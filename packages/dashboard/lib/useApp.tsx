"use client";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { firestoreCollections } from "@/lib/firebase";
import { useMemo } from "react";
import { noSSR } from "@/lib/noSSR";

// TODO suspend during load
export const useApp = (appId: string) => {
  noSSR();

  const ref = useMemo(() => doc(firestoreCollections.apps, appId), [appId]);
  const doctorRef = useMemo(
    () => firestoreCollections.getDoctorReport(appId),
    [appId],
  );
  const [app] = useDocumentData(ref);
  const [doctor] = useDocumentData(doctorRef);

  if (
    app?.updated_at &&
    doctor &&
    app.updated_at.seconds > doctor.created_at.seconds
  ) {
    return { app, ref, doctor: null };
  }

  return { app, doctor, ref };
};
