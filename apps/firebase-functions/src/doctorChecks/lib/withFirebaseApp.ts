import { Project } from "@authportal/db-types/firestore/project";
import { FirebaseApp, deleteApp, initializeApp } from "firebase/app";

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
