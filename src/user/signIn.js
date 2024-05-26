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
    let userData;

    if (!querySnapshot.empty) {
      // If email already exists, get the existing user's ID
      userRef = querySnapshot.docs[0].ref;
      userData = querySnapshot.docs[0].data();
      message = 'Email already exists, returning existing user';
    } else {
      // Add new user data to Firestore
      userData = {
        name: name,
        email: email,
        avatar: avatar,
        openId: openId
      };

      userRef = await firestore.collection('users').add(userData);

      // Update user data with the generated ID
      const userId = userRef.id;
      await userRef.update({ id: userId });

      userData = { ...userData, id: userId };
      message = 'User added successfully';
    }

    // Generate a token for the user (for example purposes, using a simple string)
    const token = `token-${userRef.id}-${Date.now()}`;

    return res.status(201).json({
      code: 1,
      message: message,
      data: {
        id: userRef.id,
        token: token,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar
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
