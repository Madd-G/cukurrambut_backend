const functions = require('firebase-functions');
const admin = require('firebase-admin');

const firestore = admin.firestore();

// Function to get barbershop data by ID
exports.getBarbershopById = functions.https.onRequest(async (req, res) => {
  try {
    const { id } = req.query;

    // Check if ID is provided
    if (!id) {
      return res.status(400).json({
        code: 0,
        message: 'ID parameter is required',
        data: {}
      });
    }

    // Retrieve barbershop data from Firestore
    const barbershopDoc = await firestore.collection('barbershops').doc(id).get();

    if (!barbershopDoc.exists) {
      return res.status(404).json({
        code: 0,
        message: 'Barbershop not found',
        data: {}
      });
    }

    const barbershopData = barbershopDoc.data();

    return res.status(200).json({
      code: 1,
      message: 'Barbershop data retrieved successfully',
      data: barbershopData
    });
  } catch (error) {
    console.error('Error retrieving barbershop data:', error);
    return res.status(500).json({
      code: 0,
      message: 'Something went wrong',
      data: {}
    });
  }
});
