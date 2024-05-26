const functions = require('firebase-functions');
const admin = require('firebase-admin');

const firestore = admin.firestore();

exports.updateAddress = functions.https.onRequest(async (req, res) => {
    try {
      const { id, address } = req.body;
  
      // Check if ID and address are provided
      if (!id || !address || !address.district || !address.city || !address.province) {
        return res.status(400).json({
          code: 0,
          message: 'ID, district, city/kabupaten, and province parameters must be provided',
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
  
      // Update address in barbershop document
      await barbershopRef.update({
        address: address
      });
  
      return res.status(200).json({
        code: 1,
        message: `Address updated successfully for barbershop ${id}`,
        data: {
          id: id,
          address: address
        }
      });
    } catch (error) {
      console.error('Error updating address:', error);
      return res.status(500).json({
        code: 0,
        message: 'Something went wrong',
        data: {}
      });
    }
  });
  