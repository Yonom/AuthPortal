"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkClients = void 0;
const DoctorReport_1 = require("./lib/DoctorReport");
const checkClients = (project) => {
    const { clients } = project;
    if (Object.keys(clients).length === 0) {
        return DoctorReport_1.DoctorReport.fromMessage({
            type: "client/none-configured",
        });
    }
    const report = new DoctorReport_1.DoctorReport();
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
exports.checkClients = checkClients;
//# sourceMappingURL=client.js.map