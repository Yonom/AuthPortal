import { onDocumentDeleted } from "firebase-functions/v2/firestore";
import { getFirestore } from "firebase-admin/firestore";

export const handleAppDelete = onDocumentDeleted(
  "apps/{app_id}",
  async (request) => {
    const domainSnapshots = await getFirestore()
      .collection("domains")
      .where("app_id", "==", request.params.app_id)
      .get();
    const domainsToDelete = domainSnapshots.docs.map((d) => d.ref);
    await Promise.all(domainsToDelete.map((d) => d.delete()));
  },
);