var admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(process.env.FIREBASE_SERVICE_ACCOUNT_KEY),
  storageBucket: process.env.BUCKET_NAME,
});
const bucket = admin.storage().bucket();

module.exports = bucket;
