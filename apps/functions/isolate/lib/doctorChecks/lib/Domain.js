"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHelperDomains = exports.getHelperDomain = exports.getDomains = void 0;
const firebase_admin_1 = require("firebase-admin");
const getDomains = (projectId) => {
    return (0, firebase_admin_1.firestore)()
        .collection("domains")
        .where("project_id", "==", projectId)
        .get()
        .then((snap) => snap.docs.map((d) => (Object.assign({ domain: d.id }, d.data()))));
};
exports.getDomains = getDomains;
const getHelperDomain = (project, domain) => {
    var _a;
    return ((_a = domain.helper_domain) !== null && _a !== void 0 ? _a : project.portal_config.firebase_config.authDomain);
};
exports.getHelperDomain = getHelperDomain;
const getHelperDomains = (project, domains) => {
    const helperDomains = {};
    for (const domain of domains) {
        const helperDomain = (0, exports.getHelperDomain)(project, domain);
        if (!helperDomains[helperDomain]) {
            helperDomains[helperDomain] = [domain.domain];
        }
        else {
            helperDomains[helperDomain].push(domain.domain);
        }
    }
    return helperDomains;
};
exports.getHelperDomains = getHelperDomains;
//# sourceMappingURL=Domain.js.map