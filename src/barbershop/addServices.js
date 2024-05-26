const functions = require('firebase-functions');
const admin = require('firebase-admin');

const firestore = admin.firestore();

// Function to add services to a barbershop
exports.addServices = functions.https.onRequest(async (req, res) => {
    try {
        const { id, services } = req.body;

        // Check required fields
        const missingFields = [];
        if (!id) missingFields.push('id');
        if (!services || !Array.isArray(services) || services.length === 0) {
            missingFields.push('services');
        } else {
            // Check each service for required fields
            services.forEach((service, index) => {
                if (!service.serviceName || !service.price) {
                    missingFields.push(`services[${index}].serviceName and services[${index}].price`);
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

        // Get barbershop by ID
        const barbershopRef = firestore.collection('barbershops').doc(id);
        const doc = await barbershopRef.get();

        if (!doc.exists) {
            return res.status(404).json({
                code: 0,
                message: 'Barbershop not found',
                data: {}
            });
        }

        // Add services to barbershop document
        const existingServices = doc.data().services || [];
        const updatedServices = [...existingServices, ...services];

        await barbershopRef.update({
            services: updatedServices
        });

        return res.status(200).json({
            code: 1,
            message: `Services added successfully to barbershop ${id}`,
            data: {
                id: id,
                services: updatedServices
            }
        });
    } catch (error) {
        console.error('Error adding services:', error);
        return res.status(500).json({
            code: 0,
            message: 'Something went wrong',
            data: {}
        });
    }
});
