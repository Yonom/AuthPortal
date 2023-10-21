"use client";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { firestoreCollections } from "@/lib/firebase";
import { useMemo } from "react";
import { noSSR } from "@/lib/noSSR";

// TODO suspend during load
export const useProject = (projectId: string) => {
  noSSR();

  const ref = useMemo(
    () => doc(firestoreCollections.projects, projectId),
    [projectId],
  );
  const doctorRef = useMemo(
    () => firestoreCollections.getDoctorReport(projectId),
    [projectId],
  );
  const [project] = useDocumentData(ref);
  const [doctor] = useDocumentData(doctorRef);

  if (
    project?.updated_at &&
    doctor &&
    project.updated_at.seconds > doctor.created_at.seconds &&
    new Date().getTime() - project.updated_at.toMillis() < 1000 * 10 // 10 second timeout
  ) {
    return { project, ref, doctor: null };
  }

  return { project, doctor, ref };
};
