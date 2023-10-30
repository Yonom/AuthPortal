"use client";
import {
  useCollection,
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import {
  DocumentReference,
  Timestamp,
  doc,
  query,
  where,
} from "firebase/firestore";
import { firestoreCollections } from "@/lib/firebase";
import { useMemo } from "react";
import { throwOnNoSSR } from "@authportal/common-ui/lib/throwOnNoSSR";
import { FirestoreDoctorReportDocument } from "@authportal/db-types/firestore/doctor";
import { Project } from "@authportal/db-types/firestore/project";
import { DomainWithId } from "@authportal/db-types/firestore/domain";

const DoctorTimeoutReport: FirestoreDoctorReportDocument = {
  created_at: Timestamp.fromDate(new Date(0)),
  messages: [
    {
      type: "general/timeout",
    },
  ],
};

type UseProjectResult =
  | {
      projectRef: DocumentReference<Project>;
      project: Project;
      doctor: FirestoreDoctorReportDocument;
      domains: DomainWithId[];
      loading: false;
      validating: boolean;
    }
  | {
      projectRef: DocumentReference<Project>;
      project: undefined;
      doctor: undefined;
      domains: undefined;
      loading: true;
      validating: boolean;
    };

// TODO suspend during load
export const useProject = (projectId: string): UseProjectResult => {
  throwOnNoSSR();

  const projectRef = useMemo(
    () => doc(firestoreCollections.projects, projectId),
    [projectId],
  );
  const doctorRef = useMemo(
    () => firestoreCollections.getDoctorReport(projectId),
    [projectId],
  );

  const domainsRef = useMemo(
    () =>
      query(firestoreCollections.domains, where("project_id", "==", projectId)),
    [projectId],
  );
  const [domainsSnapshot] = useCollection(domainsRef, {});
  const [project] = useDocumentData(projectRef);
  const [doctor] = useDocumentData(doctorRef);

  const domains = useMemo(
    () =>
      domainsSnapshot?.docs.map(
        (d) => ({ domain: d.id, ...d.data() }) as DomainWithId,
      ),
    [domainsSnapshot],
  );

  const loading = !project || !doctor || !domains;
  if (loading) {
    return {
      projectRef,
      project: undefined,
      doctor: undefined,
      domains: undefined,
      loading: true,
      validating: false,
    };
  }

  const validating =
    !!project.updated_at &&
    !!doctor.created_at &&
    project.updated_at.seconds > doctor.created_at.seconds;

  if (
    validating &&
    project.updated_at &&
    new Date().getTime() - project.updated_at.toMillis() > 1000 * 30
  ) {
    return {
      projectRef,
      project,
      doctor: DoctorTimeoutReport,
      domains,
      loading,
      validating,
    };
  }

  return { projectRef, project, doctor, domains, loading, validating };
};
