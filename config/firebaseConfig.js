var admin = require("firebase-admin");
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});
console.log("qui", serviceAccount);
const bucket = admin.storage().bucket();
console.log("Firebase bucket initialized:", bucket.name); // Ensure bucket name is correct
console.log(
  "Firebase Service Account Initialized:",
  serviceAccount.client_email
);
async function testFirebaseConnection() {
  try {
    const [files] = await bucket.getFiles({ maxResults: 1 }); // Try listing files in the bucket
    console.log(
      "Connection to Firebase successful. Files in bucket:",
      files.length > 0 ? files.map((f) => f.name) : "No files found."
    );
  } catch (error) {
    console.error("Failed to connect to Firebase Storage:", error.message);
  }
}
module.exports = bucket;
