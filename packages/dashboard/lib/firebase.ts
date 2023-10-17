import { ConfigKVObject } from "@authportal/portal-api/src/services/config";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  QueryDocumentSnapshot,
  collection,
  WithFieldValue,
  Timestamp,
} from "firebase/firestore";

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

type FirestoreDomainDocument = {
  app_id: string;
  created_at: Timestamp;
  updated_at: Timestamp;
};

const firestoreCollections = {
  apps: dataPoint<FirestoreAppDocument>("apps"),
  domains: dataPoint<FirestoreDomainDocument>("domains"),
};

export { auth, firestoreCollections, firestore };
