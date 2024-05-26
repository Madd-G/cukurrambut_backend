const functions = require('firebase-functions');
const admin = require('firebase-admin');

const firestore = admin.firestore();

exports.addAvailableCity = functions.https.onRequest(async (req, res) => {
  try {
    const { id, cities } = req.body;

    // Check if ID and cities array are provided
    if (!id || !cities || !Array.isArray(cities)) {
      return res.status(400).json({
        code: 0,
        message: 'ID and cities parameter must be provided and cities must be an array',
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

    // Update availableCities array in barbershop document
    const currentAvailableCities = doc.data().availableCities || [];
    const updatedAvailableCities = [...currentAvailableCities, ...cities];

    await barbershopRef.update({
      availableCities: updatedAvailableCities
    });

    return res.status(200).json({
      code: 1,
      message: `Cities added successfully to available cities for barbershop ${id}`,
      data: {
        id: id,
        availableCities: updatedAvailableCities
      }
    });
  } catch (error) {
    console.error('Error adding available cities to barbershop:', error);
    return res.status(500).json({
      code: 0,
      message: 'Something went wrong',
      data: {}
    });
  }
});

