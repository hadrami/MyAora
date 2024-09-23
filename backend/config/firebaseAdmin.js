const admin = require("firebase-admin");
require("dotenv").config();

// Initialize Firebase Admin with service account credentials from .env
const serviceAccount = {
  type: process.env.FIREBASE_type,
  project_id: process.env.FIREBASE_project_id,
  private_key_id: process.env.FIREBASE_private_key_id,
  private_key: process.env.FIREBASE_private_key.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_client_email,
  client_id: process.env.FIREBASE_client_id,
  auth_uri: process.env.FIREBASE_auth_uri,
  token_uri: process.env.FIREBASE_token_uri,
  auth_provider_x509_cert_url: process.env.FIREBASE_auth_provider_x509_cert_url,
  client_x509_cert_url: process.env.FIREBASE_client_x509_cert_url,
  universe_domain: process.env.FIREBASE_universe_domain,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DatabaseUrl,
});

// Initialize Firestore (admin version)
const db = admin.firestore();
module.exports = { db, admin };
