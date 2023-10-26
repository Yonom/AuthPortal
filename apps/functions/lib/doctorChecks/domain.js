"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDomains = void 0;
const auth_1 = require("firebase/auth");
const psl_1 = require("psl");
const DoctorReport_1 = require("./lib/DoctorReport");
const Domain_1 = require("./lib/Domain");
const checkDomainWhitelist = async (project, domains) => {
    var _a;
    const url = new URL("https://identitytoolkit.googleapis.com/v1/projects");
    url.searchParams.set("key", project.portal_config.firebase_config.apiKey);
    const res = await fetch(url);
    if (!res.ok) {
        return DoctorReport_1.DoctorReport.fromMessage({
            type: "internal-error",
            message: `Failed to fetch identitytoolkit project config: ${res.status} ${res.statusText}`,
        });
    }
    const data = (await res.json());
    for (const { domain } of domains) {
        if (!((_a = data.authorizedDomains) === null || _a === void 0 ? void 0 : _a.includes(domain))) {
            return DoctorReport_1.DoctorReport.fromMessage({
                type: "domain/not-whitelisted-for-oauth",
                domain,
            });
        }
    }
    return DoctorReport_1.DoctorReport.EMPTY;
};
const checkHelperDomain = (project, domain) => {
    const helperDomain = (0, Domain_1.getHelperDomain)(project, domain);
    // get the domain part of the authDomain (strip subdomains)
    const authPortalPslResult = (0, psl_1.parse)(domain.domain);
    const helperPslResult = (0, psl_1.parse)(helperDomain);
    if (authPortalPslResult.error || helperPslResult.error) {
        return DoctorReport_1.DoctorReport.fromMessage({
            type: "internal-error",
            message: `Failed to parse authDomain: ${domain} or ${helperDomain}`,
        });
    }
    // report if the parent domains mismatch
    if (authPortalPslResult.domain !== helperPslResult.domain) {
        return DoctorReport_1.DoctorReport.fromMessage({
            type: "domain/helper-domain-mismatch",
            domain: domain.domain,
        });
    }
    return DoctorReport_1.DoctorReport.EMPTY;
};
const checkDomains = async (project, domains) => {
    // report if no domains are configured
    if (domains.length === 0) {
        return DoctorReport_1.DoctorReport.fromMessage({
            type: "domain/none-configured",
        });
    }
    // if no oauth provider is configured, skip the next checks
    if (project.portal_config.providers.every((p) => p.provider_id == auth_1.EmailAuthProvider.PROVIDER_ID)) {
        return DoctorReport_1.DoctorReport.EMPTY;
    }
    // check if domain is whitelisted for oauth
    const report = new DoctorReport_1.DoctorReport();
    report.concat(await checkDomainWhitelist(project, domains));
    // check if helper domain is under the same domain
    for (const domain of domains) {
        report.concat(checkHelperDomain(project, domain));
    }
    // TODO dns records
    return report.freeze();
};
exports.checkDomains = checkDomains;
//# sourceMappingURL=domain.js.map