"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDoctor = void 0;
const firestore_1 = require("firebase-admin/firestore");
const firestore_2 = require("firebase-functions/v2/firestore");
const getDoctorReport_1 = require("../doctorChecks/getDoctorReport");
exports.runDoctor = (0, firestore_2.onDocumentWritten)("projects/{project_id}", async (request) => {
    var _a;
    const reportRef = (0, firestore_1.getFirestore)().doc(`projects/${request.params.project_id}/metadata/doctor_report`);
    const data = (_a = request.data) === null || _a === void 0 ? void 0 : _a.after.data();
    if (!data) {
        await reportRef.delete();
        return;
    }
    const report = await (0, getDoctorReport_1.getDoctorReport)(request.params.project_id, data);
    await reportRef.set({
        messages: report.messages,
        created_at: firestore_1.FieldValue.serverTimestamp(),
    });
});
//# sourceMappingURL=runDoctor.js.map