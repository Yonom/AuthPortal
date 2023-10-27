"use client";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { doc } from "firebase/firestore";
import { firestoreCollections } from "@/lib/firebase";
import { useMemo } from "react";
import { throwOnNoSSR } from "@authportal/common-ui/utils/throwOnNoSSR";

// TODO suspend during load
export const useProject = (projectId: string) => {
  throwOnNoSSR();

  const projectRef = useMemo(
    () => doc(firestoreCollections.projects, projectId),
    [projectId],
  );
  const doctorRef = useMemo(
    () => firestoreCollections.getDoctorReport(projectId),
    [projectId],
  );
  const [project] = useDocumentData(projectRef);
  const [doctor] = useDocumentData(doctorRef);

  if (
    project?.updated_at &&
    doctor &&
    project.updated_at.seconds > doctor.created_at.seconds &&
    new Date().getTime() - project.updated_at.toMillis() < 1000 * 30 // 30 second timeout
  ) {
    return { project, projectRef, doctor: null };
  }

  return { project, doctor, projectRef };
};
