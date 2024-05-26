const functions = require('firebase-functions');
const admin = require('firebase-admin');

const firestore = admin.firestore();

// Function to get all barbershops
exports.getBarbershops = functions.https.onRequest(async (req, res) => {
    try {
        // Fetch all barbershops from Firestore
        const snapshot = await firestore.collection('barbershops').get();

        if (snapshot.empty) {
            return res.status(404).json({
                code: 0,
                message: 'No barbershops found',
                data: []
            });
        }

        // Map over the documents and build the response array
        const barbershops = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return res.status(200).json({
            code: 1,
            message: 'Barbershops retrieved successfully',
            data: barbershops
        });
    } catch (error) {
        console.error('Error retrieving barbershops:', error);
        return res.status(500).json({
            code: 0,
            message: 'Something went wrong',
            data: []
        });
    }
});
