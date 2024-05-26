const functions = require('firebase-functions');
const admin = require('firebase-admin');

const firestore = admin.firestore();

// Function to set barbershop schedule by ID
exports.setBarbershopSchedule = functions.https.onRequest(async (req, res) => {
  try {
    const { id, schedule } = req.body;

    // Check if ID and schedule are provided
    if (!id || !schedule) {
      return res.status(400).json({
        code: 0,
        message: 'ID and schedule parameters are required',
        data: {}
      });
    }

    // Update barbershop schedule in Firestore
    await firestore.collection('barbershops').doc(id).update({
      schedule: schedule
    });

    return res.status(200).json({
      code: 1,
      message: 'Barbershop schedule set successfully',
      data: {
        id: id,
        schedule: schedule
      }
    });
  } catch (error) {
    console.error('Error setting barbershop schedule:', error);
    return res.status(500).json({
      code: 0,
      message: 'Something went wrong',
      data: {}
    });
  }
});
