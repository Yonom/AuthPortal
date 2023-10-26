import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { getDoctorReport } from "../doctorChecks/getDoctorReport";

export const runDoctor = onDocumentWritten(
  "projects/{project_id}",
  async (request) => {
    const reportRef = getFirestore().doc(
      `projects/${request.params.project_id}/metadata/doctor_report`,
    );

    const data = request.data?.after.data();
    if (!data) {
      await reportRef.delete();
      return;
    }

    const report = await getDoctorReport(
      request.params.project_id,
      data as Project,
    );

    await reportRef.set({
      messages: report.messages,
      created_at: FieldValue.serverTimestamp(),
    });
  },
);
