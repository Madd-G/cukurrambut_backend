const functions = require('firebase-functions');
const admin = require('firebase-admin');

const firestore = admin.firestore();

// Function to set barbershop availability by ID
exports.setBarbershopAvailability = functions.https.onRequest(async (req, res) => {
  try {
    const { id, available } = req.body;

    // Check if ID and availability are provided
    if (!id || available === undefined) {
      return res.status(400).json({
        code: 0,
        message: 'ID and availability parameters are required',
        data: {}
      });
    }

    // Update barbershop availability in Firestore
    await firestore.collection('barbershops').doc(id).update({
      available: available
    });

    return res.status(200).json({
      code: 1,
      message: `Barbershop availability set to ${available ? 'available' : 'unavailable'} successfully`,
      data: {
        id: id,
        available: available
      }
    });
  } catch (error) {
    console.error('Error setting barbershop availability:', error);
    return res.status(500).json({
      code: 0,
      message: 'Something went wrong',
      data: {}
    });
  }
});
