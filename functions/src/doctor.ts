import { firestore } from "firebase-admin";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import {
  FirebaseApp,
  FirebaseError,
  deleteApp,
  initializeApp,
} from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { z } from "zod";

type DoctorMessage =
  | {
      id: "firebase/missing-config" | "firebase/bad-config";
    }
  | {
      id: "internal-error";
      message: string;
    };

class DoctorReport {
  messages: DoctorMessage[] = [];

  addMessage(message: DoctorMessage) {
    this.messages.push(message);
    return this;
  }

  concat(report: DoctorReport) {
    this.messages = this.messages.concat(report.messages);
    return this;
  }

  freeze() {
    for (const message of this.messages) {
      Object.freeze(message);
    }
    Object.freeze(this.messages);
    Object.freeze(this);

    return this;
  }

  static EMPTY = new DoctorReport().freeze();
}

const FirestoreAppDocument = z.object({
  admin_config: z.object({
    name: z.string(),
    members: z.array(z.string()),
  }),
  portal_config: z.object({
    providers: z.array(
      z.object({
        provider_id: z.string(),
      }),
    ),
    firebase_config: z.record(z.string()),
  }),
  clients: z.record(
    z.object({
      redirect_uris: z.array(z.string()),
    }),
  ),
});

const FirebaseConfig = z
  .object({
    apiKey: z.string(),
    authDomain: z.string().optional(),
    projectId: z.string().optional(),
    storageBucket: z.string().optional(),
    messagingSenderId: z.string().optional(),
    appId: z.string().optional(),
    measurementId: z.string().optional(),
  })
  .strict();

type FirestoreAppDocument = z.infer<typeof FirestoreAppDocument>;

const withFirebaseApp = async (
  appDoc: FirestoreAppDocument,
  callback?: (
    app: FirebaseApp,
  ) => Promise<DoctorReport | void> | DoctorReport | undefined,
) => {
  const app = initializeApp(
    appDoc.portal_config.firebase_config,
    Math.random().toString(),
  );

  try {
    return (await callback?.(app)) ?? DoctorReport.EMPTY;
  } finally {
    deleteApp(app);
  }
};

const checkFirebaseConfig = async (appDoc: FirestoreAppDocument) => {
  return new DoctorReport().concat(
    await withFirebaseApp(appDoc, async (app) => {
      try {
        const auth = getAuth(app);
        await signInWithEmailAndPassword(
          auth,
          "authportal-test@example.com",
          Math.random().toString(),
        );
        return undefined;
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
          return undefined;
        } else {
          return new DoctorReport().addMessage({
            id: "internal-error",
            message: `Firebase error: ${ex.message}`,
          });
        }
      }
    }),
  );
};

const checkDocSchema = async (appDoc: FirestoreAppDocument) => {
  const res = FirestoreAppDocument.safeParse(appDoc);
  if (res.success) return DoctorReport.EMPTY;

  return new DoctorReport().addMessage({
    id: "internal-error",
    message: `App document is invalid: ${res.error.message}`,
  });
};

const checkFirebaseConfigSchema = async (appDoc: FirestoreAppDocument) => {
  if (Object.keys(appDoc.portal_config.firebase_config).length === 0) {
    return new DoctorReport().addMessage({
      id: "firebase/missing-config",
    });
  }

  const res = FirebaseConfig.safeParse(appDoc.portal_config.firebase_config);
  if (res.success) return DoctorReport.EMPTY;

  return new DoctorReport().addMessage({
    id: "firebase/bad-config",
  });
};

class DoctorBlockError extends Error {}

const getDoctorReport = async (appDoc: FirestoreAppDocument) => {
  const report = new DoctorReport();
  const add = async (r: DoctorReport, blocking = false) => {
    report.concat(r);
    if (blocking && r.messages.length > 0) {
      throw new DoctorBlockError();
    }
  };

  try {
    add(await checkDocSchema(appDoc), true);
    add(await checkFirebaseConfigSchema(appDoc), true);
    add(await checkFirebaseConfig(appDoc), true);
  } catch (ex: unknown) {
    if (!(ex instanceof DoctorBlockError)) throw ex;
  }

  return report;
};

export const runDoctor = onDocumentWritten("apps/{app_id}", async (request) => {
  const data = request.data?.after.data();
  if (!data) return;

  const report = await getDoctorReport(data as FirestoreAppDocument);
  firestore().doc(`apps/${request.params.app_id}/metadata/doctor_report`).set({
    messages: report.messages,
    created_at: firestore.FieldValue.serverTimestamp(),
  });
});

// TODO test cases
