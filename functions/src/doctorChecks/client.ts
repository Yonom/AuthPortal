import { DoctorReport } from "./lib/DoctorReport";
import { FirestoreAppDocument } from "./lib/FirestoreAppDocument";

export const checkClients = (appDoc: FirestoreAppDocument) => {
  const { clients } = appDoc;
  if (Object.keys(clients).length === 0) {
    return DoctorReport.fromMessage({
      type: "client/none-configured",
    });
  }

  const report = new DoctorReport();
  for (const [client_id, client] of Object.entries(clients)) {
    if (client.redirect_uris.length === 0) {
      report.addMessage({
        type: "client/no-redirect-uris",
        client_id,
      });
    }
  }
  return report.freeze();
};
