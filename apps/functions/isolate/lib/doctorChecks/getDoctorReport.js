"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDoctorReport = void 0;
const DoctorReport_1 = require("./lib/DoctorReport");
const Project_1 = require("./lib/Project");
const config_1 = require("./config");
const Domain_1 = require("./lib/Domain");
const client_1 = require("./client");
const domain_1 = require("./domain");
const provider_1 = require("./provider");
const checkProjectSchema = (project) => {
    const res = Project_1.Project.safeParse(project);
    if (res.success)
        return DoctorReport_1.DoctorReport.EMPTY;
    return DoctorReport_1.DoctorReport.fromMessage({
        type: "internal-error",
        message: `Project document is invalid: ${res.error.message}`,
    });
};
const getDoctorReport = async (projectId, project) => {
    const domains = await (0, Domain_1.getDomains)(projectId);
    const report = new DoctorReport_1.DoctorReport();
    try {
        report
            .concat(checkProjectSchema(project))
            // config/*
            .concat((0, config_1.checkFirebaseConfigSchema)(project))
            .concat(await (0, config_1.checkFirebaseConfig)(project))
            // provider/*
            .concat((0, provider_1.ensureHasProviders)(project))
            .concat(await (0, provider_1.checkProviders)(project, domains))
            // domain/*
            .concat(await (0, domain_1.checkDomains)(project, domains))
            // client/*
            .concat((0, client_1.checkClients)(project));
    }
    catch (ex) {
        if (ex instanceof DoctorReport_1.DoctorReport) {
            report.concat(ex);
        }
        else {
            report.addMessage({
                type: "internal-error",
                message: `Unhandled error: ${ex}`,
                stack: ex.stack,
            });
        }
    }
    return report.freeze();
};
exports.getDoctorReport = getDoctorReport;
//# sourceMappingURL=getDoctorReport.js.map