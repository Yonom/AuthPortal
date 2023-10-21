import { FirebaseApp, deleteApp, initializeApp } from "firebase/app";
import { Project } from "./Project";

export const withFirebaseApp = async <T>(
  project: Project,
  callback: (app: FirebaseApp) => Promise<T>,
): Promise<T> => {
  const app = initializeApp(
    project.portal_config.firebase_config,
    Math.random().toString(),
  );

  try {
    return await callback(app);
  } finally {
    deleteApp(app);
  }
};
