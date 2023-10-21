import { onDocumentDeleted } from "firebase-functions/v2/firestore";
import { getFirestore } from "firebase-admin/firestore";

export const handleProjectDelete = onDocumentDeleted(
  "projects/{project_id}",
  async (request) => {
    const domainSnapshots = await getFirestore()
      .collection("domains")
      .where("project_id", "==", request.params.project_id)
      .get();
    const domainsToDelete = domainSnapshots.docs.map((d) => d.ref);
    await Promise.all(domainsToDelete.map((d) => d.delete()));
  },
);
