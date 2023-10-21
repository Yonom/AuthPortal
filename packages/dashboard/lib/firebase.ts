import { ConfigKVObject } from "@authportal/portal-api/src/services/config";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  QueryDocumentSnapshot,
  collection,
  WithFieldValue,
  Timestamp,
  doc,
} from "firebase/firestore";

// TODO duplicate
export type DoctorMessage =
  | {
      type:
        | "config/missing"
        | "config/malformed"
        | "config/invalid-api-key"
        | "config/auth-not-enabled"
        | "provider/none-configured"
        | "domain/none-configured"
        | "client/none-configured";
    }
  | {
      type: "internal-error";
      message: string;
      stack?: string;
    }
  | {
      type: "provider/not-enabled";
      provider_id: string;
    }
  | {
      type:
        | "domain/not-whitelisted-for-oauth"
        | "domain/helper-domain-mismatch";
      domain: string;
    }
  | {
      type: "provider/redirect-uri-not-whitelisted";
      domain: string;
      helper_domain: string;
      provider_id: string;
    }
  | {
      type: "client/no-redirect-uris";
      client_id: string;
    };

export const firebaseConfig = JSON.parse(
  process.env.NEXT_PUBLIC_FIREBASE_CONFIG as string,
);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

const converter = <T>() => ({
  toFirestore: (data: WithFieldValue<T>) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as T,
});

const dataPoint = <T>(collectionPath: string) =>
  collection(firestore, collectionPath).withConverter(converter<T>());

type FirestoreAppDocument = ConfigKVObject & {
  admin_config: {
    name: string;
    members: string[];
  };
  created_at: Timestamp;
  updated_at: Timestamp;
};

// TODO duplicate
export type DoctorReport = {
  messages: DoctorMessage[];
  created_at: Timestamp;
};

type FirestoreDomainDocument = {
  app_id: string;
  created_at: Timestamp;
  updated_at: Timestamp;
};

const firestoreCollections = {
  apps: dataPoint<FirestoreAppDocument>("apps"),
  getDoctorReport: (appId: string) =>
    doc(dataPoint<DoctorReport>("apps"), appId, "metadata", "doctor_report"),
  domains: dataPoint<FirestoreDomainDocument>("domains"),
};

export { auth, firestoreCollections, firestore };
