import { firestore } from "firebase-admin";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { getDoctorReport } from "./doctorChecks/getDoctorReport";
import { FirestoreAppDocument } from "./doctorChecks/lib/FirestoreAppDocument";

export const runDoctor = onDocumentWritten("apps/{app_id}", async (request) => {
  const data = request.data?.after.data();
  if (!data) return;

  const report = await getDoctorReport(
    request.params.app_id,
    data as FirestoreAppDocument,
  );
  firestore().doc(`apps/${request.params.app_id}/metadata/doctor_report`).set({
    messages: report.messages,
    created_at: firestore.FieldValue.serverTimestamp(),
  });
});

// TODO test cases
