const functions = require('firebase-functions');
const admin = require('firebase-admin');

const firestore = admin.firestore();

exports.updateHomeServiceStatus = functions.https.onRequest(async (req, res) => {
    try {
      const { id, homeService } = req.body;
  
      // Check if ID and homeService are provided
      if (!id || homeService === undefined) {
        return res.status(400).json({
          code: 0,
          message: 'ID and homeService parameter must be provided',
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
  
      // Update homeService status in barbershop document
      await barbershopRef.update({
        homeService: homeService
      });
  
      return res.status(200).json({
        code: 1,
        message: `Home service status updated successfully for barbershop ${id}`,
        data: {
          id: id,
          homeService: homeService
        }
      });
    } catch (error) {
      console.error('Error updating home service status:', error);
      return res.status(500).json({
        code: 0,
        message: 'Something went wrong',
        data: {}
      });
    }
  });
  