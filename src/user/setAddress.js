const functions = require('firebase-functions');
const admin = require('firebase-admin');

const firestore = admin.firestore();

// Function to set address for a user
exports.setAddress = functions.https.onRequest(async (req, res) => {
  try {
    const { id, address } = req.body;

    // Check required fields
    const missingFields = [];
    if (!id) missingFields.push('id');
    if (!address) missingFields.push('address');
    if (address) {
      if (!address.province) missingFields.push('address.province');
      if (!address.city) missingFields.push('address.city');
      if (!address.district) missingFields.push('address.district');
      if (typeof address.longitude === 'undefined') missingFields.push('address.longitude');
      if (typeof address.latitude === 'undefined') missingFields.push('address.latitude');
    }

    // If there are missing fields, return an error
    if (missingFields.length > 0) {
      return res.status(400).json({
        code: 0,
        message: `The following fields are required: ${missingFields.join(', ')}`,
        data: {}
      });
    }

    // Construct full address
    let fullAddress = `${address.street ? address.street + ', ' : ''}${address.district}, ${address.city}, ${address.province}`;

    // Get the user reference
    const userRef = firestore.collection('users').doc(id);

    // Check if the user exists
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return res.status(404).json({
        code: 0,
        message: 'User not found',
        data: {}
      });
    }

    // Update the user document with the address
    await userRef.update({ address: { ...address, fullAddress } });

    return res.status(200).json({
      code: 1,
      message: 'Address added successfully',
      data: {
        id: id,
        address: { ...address, fullAddress }
      }
    });
  } catch (error) {
    console.error('Error setting address:', error);
    return res.status(500).json({
      code: 0,
      message: 'Something went wrong',
      data: {}
    });
  }
});
