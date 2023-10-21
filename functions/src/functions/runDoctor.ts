import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { getDoctorReport } from "../doctorChecks/getDoctorReport";
import { Project } from "../doctorChecks/lib/Project";

export const runDoctor = onDocumentWritten(
  "projects/{project_id}",
  async (request) => {
    const data = request.data?.after.data();
    if (!data) return;

    const report = await getDoctorReport(
      request.params.project_id,
      data as Project,
    );

    getFirestore()
      .doc(`projects/${request.params.project_id}/metadata/doctor_report`)
      .set({
        messages: report.messages,
        created_at: FieldValue.serverTimestamp(),
      });
  },
);
