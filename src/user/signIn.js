const functions = require('firebase-functions');
const admin = require('firebase-admin');

const firestore = admin.firestore();

// Function to add a new user
exports.signIn = functions.https.onRequest(async (req, res) => {
  try {
    const { name, email, avatar, openId } = req.body;

    // Check which fields are missing
    const missingFields = [];
    if (!name) missingFields.push('name');
    if (!email) missingFields.push('email');
    if (!avatar) missingFields.push('avatar');
    if (!openId) missingFields.push('openId');

    // If there are missing fields, return an error
    if (missingFields.length > 0) {
      return res.status(400).json({
        code: 0,
        message: `The following fields are required: ${missingFields.join(', ')}`,
        data: {}
      });
    }

    // Check if email already exists in the 'users' collection
    const usersRef = firestore.collection('users');
    const querySnapshot = await usersRef.where('email', '==', email).get();

    let userRef;
    let message;

    if (!querySnapshot.empty) {
      // If email already exists, get the existing user's ID
      userRef = querySnapshot.docs[0].ref;
      message = 'Email already exists, returning existing user';
    } else {
      // Add new user data to Firestore
      const userData = {
        name: name,
        email: email,
        avatar: avatar,
        openId: openId
      };

      userRef = await firestore.collection('users').add(userData);
      message = 'User added successfully';
    }

    // Generate a token for the user (for example purposes, using a simple string)
    const token = `token-${userRef.id}-${Date.now()}`;

    const userData = await userRef.get();

    return res.status(201).json({
      code: 1,
      message: message,
      data: {
        id: userRef.id,
        token: token,
        name: userData.data().name,
        email: userData.data().email,
        avatar: userData.data().avatar
      }
    });
  } catch (error) {
    console.error('Error adding user:', error);
    return res.status(500).json({
      code: 0,
      message: 'Something went wrong',
      data: {}
    });
  }
});
