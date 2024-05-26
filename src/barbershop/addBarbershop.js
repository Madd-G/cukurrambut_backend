const functions = require('firebase-functions');
const admin = require('firebase-admin');

const firestore = admin.firestore();

// Function to add a new barbershop
exports.addBarbershop = functions.https.onRequest(async (req, res) => {
    try {
        const { homeService, address, coordinates, description, profilePicture, name, availableCities } = req.body;

        // Check required fields
        const missingFields = [];
        if (homeService === undefined) missingFields.push('homeService');
        if (!address || !address.province || !address.city || !address.district) missingFields.push('address');
        if (!coordinates || !coordinates.latitude || !coordinates.longitude) missingFields.push('coordinates');
        if (!description) missingFields.push('description');
        if (!name) missingFields.push('name');

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
            homeService: homeService,
            address: address,
            coordinates: coordinates,
            description: description,
            profilePicture: profilePicture || null,
            name: name,
            availableCities: availableCities || [],
            createdAt: new Date().toISOString(),
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
