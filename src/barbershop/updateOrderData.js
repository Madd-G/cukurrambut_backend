const functions = require('firebase-functions');
const admin = require('firebase-admin');

const firestore = admin.firestore();

exports.updateOrderData = functions.https.onRequest(async (req, res) => {
    try {
        const { id, services } = req.body;

        // Check if ID and services are provided
        if (!id || !services || !Array.isArray(services)) {
            return res.status(400).json({
                code: 0,
                message: 'ID and services parameter must be provided and services must be an array',
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

        // Update order data in barbershop document
        const updatedServices = doc.data().services.map(service => {
            if (services.includes(service.serviceName)) {
                service.totalOrders = (service.totalOrders || 0) + 1;
            }
            return service;
        });

        const totalOrdersAllServices = updatedServices.reduce((total, service) => {
            return total + (service.totalOrders || 0);
        }, 0);

        await barbershopRef.update({
            services: updatedServices,
            totalOrdersAllServices: totalOrdersAllServices
        });

        return res.status(200).json({
            code: 1,
            message: `Order data updated successfully for barbershop ${id}`,
            data: {
                id: id,
                services: updatedServices,
                totalOrdersAllServices: totalOrdersAllServices
            }
        });
    } catch (error) {
        console.error('Error updating order data:', error);
        return res.status(500).json({
            code: 0,
            message: 'Something went wrong',
            data: {}
        });
    }
});

