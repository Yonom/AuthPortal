import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  QueryDocumentSnapshot,
  collection,
  WithFieldValue,
  doc,
} from "firebase/firestore";
import { Project } from "@authportal/db-types/firestore/project";
import { DoctorReport } from "@authportal/db-types/firestore/doctor";
import { FirestoreDomainDocument } from "@authportal/db-types/firestore/domain";

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

const firestoreCollections = {
  projects: dataPoint<Project>("projects"),
  getDoctorReport: (projectId: string) =>
    doc(
      dataPoint<DoctorReport>("projects"),
      projectId,
      "metadata",
      "doctor_report",
    ),
  domains: dataPoint<FirestoreDomainDocument>("domains"),
};

export { auth, firestoreCollections, firestore };
