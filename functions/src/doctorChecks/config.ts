import { z } from "zod";
import { DoctorReport } from "./lib/DoctorReport";
import { FirestoreAppDocument } from "./lib/FirestoreAppDocument";
import { FirebaseError } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { withFirebaseApp } from "./lib/withFirebaseApp";

const FirebaseConfig = z
  .object({
    apiKey: z.string(),
    authDomain: z.string(),
    projectId: z.string(),
    storageBucket: z.string(),
    messagingSenderId: z.string(),
    appId: z.string(),
    measurementId: z.string().optional(),
  })
  .strict();

export const checkFirebaseConfigSchema = (appDoc: FirestoreAppDocument) => {
  if (Object.keys(appDoc.portal_config.firebase_config).length === 0) {
    // fatal, throw
    throw DoctorReport.fromMessage({
      type: "config/missing",
    });
  }

  const res = FirebaseConfig.safeParse(appDoc.portal_config.firebase_config);
  if (res.success) return DoctorReport.EMPTY;

  return DoctorReport.fromMessage({
    type: "config/malformed",
  });
};

export const checkFirebaseConfig = async (appDoc: FirestoreAppDocument) => {
  return withFirebaseApp(appDoc, async (app) => {
    try {
      const auth = getAuth(app);
      await signInWithEmailAndPassword(
        auth,
        "authportal-test@example.com",
        Math.random().toString(),
      );
      return DoctorReport.EMPTY;
    } catch (ex: unknown) {
      if (!(ex instanceof FirebaseError)) throw ex;
      const errorWhitelist = [
        "auth/operation-not-allowed",
        "auth/app-not-authorized",
        "auth/user-disabled",
        "auth/user-not-found",
        "auth/wrong-password",
        "auth/invalid-login-credentials",
      ];
      if (errorWhitelist.includes(ex.code)) {
        return DoctorReport.EMPTY;
      } else if (
        ex.code === "auth/invalid-api-key" ||
        ex.code === "auth/api-key-not-valid.-please-pass-a-valid-api-key." // TODO investigate
      ) {
        // fatal, throw
        throw DoctorReport.fromMessage({
          type: "config/invalid-api-key",
        });
      } else if (ex.code === "auth/configuration-not-found") {
        // fatal, throw
        throw DoctorReport.fromMessage({
          type: "config/auth-not-enabled",
        });
      } else {
        // fatal, throw
        throw ex;
      }
    }
  });
};
