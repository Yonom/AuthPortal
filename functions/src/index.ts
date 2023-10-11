import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp();

export const syncAppsToCloudflare = onDocumentWritten(
  "apps/{appId}",
  async (request) => {
    const data = request.data?.after.data();
    if (!data) return;

    const { portal_config, clients } = data;
    const domainSnapshots = await getFirestore()
      .collection("domains")
      .where("appId", "==", request.params.appId)
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
      },
    });
  },
);
