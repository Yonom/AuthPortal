import { FirebaseApp, deleteApp, initializeApp } from "firebase/app";
import { FirestoreAppDocument } from "./FirestoreAppDocument";

export const withFirebaseApp = async <T>(
  appDoc: FirestoreAppDocument,
  callback: (app: FirebaseApp) => Promise<T>,
): Promise<T> => {
  const app = initializeApp(
    appDoc.portal_config.firebase_config,
    Math.random().toString(),
  );

  try {
    return await callback(app);
  } finally {
    deleteApp(app);
  }
};
