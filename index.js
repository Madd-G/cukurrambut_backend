const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const admin = require('firebase-admin');

admin.initializeApp();

// USER
const userAPI  = require('./src/user');

module.exports = {
    ...userAPI,
};


// firebase emulators:start --only functions,firestore --import ./firebase-export --export-on-exit ./firebase-export
