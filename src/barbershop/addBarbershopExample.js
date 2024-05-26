const functions = require('firebase-functions');
const admin = require('firebase-admin');

const firestore = admin.firestore();

// Function to add a new barbershop with more detailed data
exports.addBarbershopExample = functions.https.onRequest(async (req, res) => {
    try {
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
        } = req.body;

        // Check required fields
        const missingFields = [];
        if (!name) missingFields.push('name');
        if (!coordinates || !coordinates.latitude || !coordinates.longitude) missingFields.push('coordinates');
        if (!description) missingFields.push('description');
        if (!profilePicture) missingFields.push('profilePicture');
        if (!pictures || !Array.isArray(pictures)) missingFields.push('pictures');
        if (!address || !address.province || !address.city || !address.kecamatan) missingFields.push('address');
        if (!schedule || typeof schedule !== 'object') missingFields.push('schedule');
        if (!services || !Array.isArray(services)) {
            missingFields.push('services');
        } else {
            // Check each service for required fields
            services.forEach((service, index) => {
                if (!service.serviceName || !service.price || !service.totalOrders) {
                    missingFields.push(`services[${index}].serviceName, services[${index}].price and services[${index}].totalOrders`);
                }
            });
        }

        // If there are missing fields, return an error
        if (missingFields.length > 0) {
            return res.status(400).json({
                code: 0,
                message: `The following fields are required: ${missingFields.join(', ')}`,
                data: {}
            });
        }

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

        return res.status(201).json({
            code: 1,
            message: 'Barbershop added successfully',
            data: updatedBarbershopData
        });
    } catch (error) {
        console.error('Error adding barbershop:', error);
        return res.status(500).json({
            code: 0,
            message: 'Something went wrong',
            data: {}
        });
    }
});
