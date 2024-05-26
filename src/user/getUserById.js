const functions = require('firebase-functions');
const admin = require('firebase-admin');

const firestore = admin.firestore();

// Function to get a user by ID
exports.getUserById = functions.https.onRequest(async (req, res) => {
  try {
    const { id } = req.query;

    // Check if ID is provided
    if (!id) {
      return res.status(400).json({
        code: 0,
        message: 'User ID is required',
        data: {}
      });
    }

    // Get the user document reference
    const userRef = firestore.collection('users').doc(id);

    // Fetch the user document
    const userDoc = await userRef.get();

    // Check if the user exists
    if (!userDoc.exists) {
      return res.status(404).json({
        code: 0,
        message: 'User not found',
        data: {}
      });
    }

    // Return the user data
    return res.status(200).json({
      code: 1,
      message: 'User fetched successfully',
      data: {
        id: userDoc.id,
        ...userDoc.data()
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({
      code: 0,
      message: 'Something went wrong',
      data: {}
    });
  }
});
