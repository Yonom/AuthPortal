import { Project } from "@authportal/db-types/firestore/project";
import { DoctorReport } from "./lib/DoctorReport";

export const checkClients = (project: Project) => {
  const { clients } = project;
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
