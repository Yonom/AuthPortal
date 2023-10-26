"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncProjectsToCloudflare = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const firestore_2 = require("firebase-admin/firestore");
exports.syncProjectsToCloudflare = (0, firestore_1.onDocumentWritten)("projects/{project_id}", async (request) => {
    var _a;
    const { API_KEY } = process.env;
    if (!API_KEY) {
        throw new Error("API_KEY is not set");
    }
    const data = (_a = request.data) === null || _a === void 0 ? void 0 : _a.after.data();
    if (!data)
        return;
    const { portal_config, clients } = data;
    const domainSnapshots = await (0, firestore_2.getFirestore)()
        .collection("domains")
        .where("project_id", "==", request.params.project_id)
        .get();
    const domains = domainSnapshots.docs.map((d) => d.id);
    const payload = {
        portal_config,
        clients,
        domains,
    };
    await fetch("https://portal-api.authportal.dev/api/config", {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
        },
    });
});
//# sourceMappingURL=syncProjectsToCloudflare.js.map