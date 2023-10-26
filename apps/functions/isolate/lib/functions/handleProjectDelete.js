"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleProjectDelete = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const firestore_2 = require("firebase-admin/firestore");
exports.handleProjectDelete = (0, firestore_1.onDocumentDeleted)("projects/{project_id}", async (request) => {
    const domainSnapshots = await (0, firestore_2.getFirestore)()
        .collection("domains")
        .where("project_id", "==", request.params.project_id)
        .get();
    const domainsToDelete = domainSnapshots.docs.map((d) => d.ref);
    await Promise.all(domainsToDelete.map((d) => d.delete()));
});
//# sourceMappingURL=handleProjectDelete.js.map