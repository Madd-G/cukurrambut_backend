const functions = require('firebase-functions');
const admin = require('firebase-admin');

const firestore = admin.firestore();

// Function to add multiple barbershops with more detailed data
exports.addMultipleBarbershopExample = functions.https.onRequest(async (req, res) => {
    try {
        const barbershops = req.body.barbershops;

        // Check if the barbershops array is provided and valid
        if (!Array.isArray(barbershops) || barbershops.length === 0) {
            return res.status(400).json({
                code: 0,
                message: 'The barbershops array is required and must contain at least one barbershop object',
                data: {}
            });
        }

        const missingFields = [];
        const addedBarbershops = [];

        for (const [index, barbershop] of barbershops.entries()) {
            const {
                name,
                coordinates,
                description,
                profilePicture,
                pictures,
                branches,
                additionalData,
                homeService,
                address,
                available,
                schedule,
                services,
                totalOrdersAllServices,
                availableCities
            } = barbershop;

            // Check required fields for each barbershop
            if (!name) missingFields.push(`barbershops[${index}].name`);
            if (!coordinates || !coordinates.latitude || !coordinates.longitude) missingFields.push(`barbershops[${index}].coordinates`);
            if (!description) missingFields.push(`barbershops[${index}].description`);
            if (!profilePicture) missingFields.push(`barbershops[${index}].profilePicture`);
            if (!pictures || !Array.isArray(pictures)) missingFields.push(`barbershops[${index}].pictures`);
            if (!address || !address.province || !address.city || !address.district) missingFields.push(`barbershops[${index}].address`);
            if (!schedule || typeof schedule !== 'object') missingFields.push(`barbershops[${index}].schedule`);
            if (!services || !Array.isArray(services)) {
                missingFields.push(`barbershops[${index}].services`);
            } else {
                // Check each service for required fields
                services.forEach((service, serviceIndex) => {
                    if (!service.serviceName || !service.price || !service.totalOrders) {
                        missingFields.push(`barbershops[${index}].services[${serviceIndex}].serviceName, barbershops[${index}].services[${serviceIndex}].price, and barbershops[${index}].services[${serviceIndex}].totalOrders`);
                    }
                });
            }

            if (missingFields.length > 0) continue;

            // Create barbershop data object
            const barbershopData = {
                name: name,
                coordinates: coordinates,
                description: description,
                profilePicture: profilePicture,
                pictures: pictures,
                branches: branches || [],
                additionalData: additionalData || {},
                homeService: homeService || false,
                address: address,
                available: available || false,
                schedule: schedule,
                services: services,
                totalOrdersAllServices: totalOrdersAllServices || 0,
                availableCities: availableCities || [],
                createdAt: new Date().toISOString()
            };

            // Add barbershop data to Firestore with auto-generated ID
            const barbershopRef = await firestore.collection('barbershops').add(barbershopData);

            // Get the generated ID
            const barbershopId = barbershopRef.id;

            // Update barbershop data object with the generated ID
            const updatedBarbershopData = {
                ...barbershopData,
                id: barbershopId
            };

            // Update the barbershop data in Firestore with the generated ID
            await barbershopRef.update({ id: barbershopId });

            addedBarbershops.push(updatedBarbershopData);
        }

        if (missingFields.length > 0) {
            return res.status(400).json({
                code: 0,
                message: `The following fields are required: ${missingFields.join(', ')}`,
                data: {}
            });
        }

        return res.status(201).json({
            code: 1,
            message: 'Barbershops added successfully',
            data: addedBarbershops
        });
    } catch (error) {
        console.error('Error adding barbershops:', error);
        return res.status(500).json({
            code: 0,
            message: 'Something went wrong',
            data: {}
        });
    }
});
