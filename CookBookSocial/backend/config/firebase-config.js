import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import dotenv from "dotenv";

dotenv.config();
// import serviceAccount from `process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH`;

// import serviceAccountKey from "./serviceAccountKey.json" assert { type: "json" };

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/gm, "\n")
      : undefined,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});

const auth = getAuth(app);
export default auth;
