"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDomainDelete = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
exports.handleDomainDelete = (0, firestore_1.onDocumentDeleted)("domains/{domain}", async (request) => {
    const { API_KEY } = process.env;
    if (!API_KEY) {
        throw new Error("API_KEY is not set");
    }
    const url = new URL("https://portal-api.authportal.dev/api/config");
    url.searchParams.set("domain", request.params.domain);
    await fetch(url, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${API_KEY}`,
        },
    });
});
//# sourceMappingURL=handleDomainDelete.js.map