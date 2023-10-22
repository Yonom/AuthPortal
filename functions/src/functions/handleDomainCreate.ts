import { getFirestore } from "firebase-admin/firestore";
import { onDocumentCreated } from "firebase-functions/v2/firestore";

export const handleDomainCreate = onDocumentCreated(
  "domains/{domain}",
  async (request) => {
    await getFirestore()
      .doc(`domains/${request.params.domain}/metadata/exists`)
      .set({ exists: true });
  },
);
