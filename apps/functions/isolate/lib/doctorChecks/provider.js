"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkProviders = exports.ensureHasProviders = void 0;
const app_1 = require("firebase/app");
const auth_1 = require("firebase/auth");
const DoctorReport_1 = require("./lib/DoctorReport");
const withFirebaseApp_1 = require("./lib/withFirebaseApp");
const Domain_1 = require("./lib/Domain");
const ensureHasProviders = (project) => {
    const { providers } = project.portal_config;
    if (providers.length === 0) {
        return DoctorReport_1.DoctorReport.fromMessage({
            type: "provider/none-configured",
        });
    }
    return DoctorReport_1.DoctorReport.EMPTY;
};
exports.ensureHasProviders = ensureHasProviders;
const withProviderEnabledReport = async (project, provider_id, callback) => {
    try {
        await (0, withFirebaseApp_1.withFirebaseApp)(project, async (app) => {
            const auth = (0, auth_1.getAuth)(app);
            await callback(auth);
        });
        return DoctorReport_1.DoctorReport.EMPTY;
    }
    catch (ex) {
        if (!(ex instanceof app_1.FirebaseError))
            throw ex;
        if (ex.code === "auth/operation-not-allowed") {
            return DoctorReport_1.DoctorReport.fromMessage({
                type: "provider/not-enabled",
                provider_id,
            });
        }
        else {
            return DoctorReport_1.DoctorReport.EMPTY;
        }
    }
};
const getAuthUri = async (project, helperDomain) => {
    const url = new URL("https://www.googleapis.com/identitytoolkit/v3/relyingparty/createAuthUri");
    url.searchParams.set("key", project.portal_config.firebase_config.apiKey);
    const res = await fetch(url, {
        method: "POST",
        redirect: "manual",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            providerId: "google.com",
            continueUri: `https://${helperDomain}/__/auth/handler`,
        }),
    });
    if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error.message);
    }
    const { authUri } = await res.json();
    return authUri;
};
const checkForGoogleRedirectToError = async (authUri) => {
    var _a;
    const res = await fetch(authUri, {
        redirect: "manual",
    });
    return (_a = res.headers
        .get("Location")) === null || _a === void 0 ? void 0 : _a.startsWith("https://accounts.google.com/signin/oauth/error");
};
const validateGoogleRedirectUri = async (project, domains) => {
    const helperDomains = (0, Domain_1.getHelperDomains)(project, domains);
    const report = new DoctorReport_1.DoctorReport();
    for (const [helperDomain, domains] of Object.entries(helperDomains)) {
        try {
            const authUri = await getAuthUri(project, helperDomain);
            if (await checkForGoogleRedirectToError(authUri)) {
                for (const domain of domains) {
                    report.addMessage({
                        type: "provider/redirect-uri-not-whitelisted",
                        helper_domain: helperDomain,
                        domain,
                        provider_id: auth_1.GoogleAuthProvider.PROVIDER_ID,
                    });
                }
            }
        }
        catch (ex) {
            report.addMessage({
                type: "internal-error",
                message: `Failed to validate redirect uri: ${ex}`,
                stack: ex.stack,
            });
        }
    }
    return report.freeze();
};
// const AppleAuthProvider = new OAuthProvider("apple.com");
const checkProvider = async (project, provider, domains) => {
    // TODO redirect uri validation for each provider
    const { provider_id } = provider;
    switch (provider_id) {
        case auth_1.EmailAuthProvider.PROVIDER_ID: {
            return withProviderEnabledReport(project, provider_id, (auth) => (0, auth_1.signInWithEmailAndPassword)(auth, "authportal-test@example.com", Math.random().toString()));
        }
        case auth_1.GoogleAuthProvider.PROVIDER_ID: {
            const providerEnabled = await withProviderEnabledReport(project, provider_id, (auth) => (0, auth_1.signInWithCredential)(auth, auth_1.GoogleAuthProvider.credential("-")));
            if (providerEnabled.messages.length > 0)
                return providerEnabled;
            return validateGoogleRedirectUri(project, domains);
        }
        // case FacebookAuthProvider.PROVIDER_ID:
        //   return withProviderEnabledReport(project, provider_id, (auth) =>
        //     signInWithCredential(auth, FacebookAuthProvider.credential("-")),
        //   );
        // case GithubAuthProvider.PROVIDER_ID:
        //   return withProviderEnabledReport(project, provider_id, (auth) =>
        //     signInWithCredential(auth, GithubAuthProvider.credential("-")),
        //   );
        // case AppleAuthProvider.providerId:
        //   return withProviderEnabledReport(project, provider_id, (auth) =>
        //     signInWithCredential(
        //       auth,
        //       AppleAuthProvider.credential({ idToken: "-" }),
        //     ),
        //   );
        default:
            return DoctorReport_1.DoctorReport.fromMessage({
                type: "internal-error",
                message: `Unknown provider: ${provider_id}`,
            });
    }
};
const checkProviders = async (project, domains) => {
    const report = new DoctorReport_1.DoctorReport();
    const { providers } = project.portal_config;
    for (const provider of providers) {
        report.concat(await checkProvider(project, provider, domains));
    }
    return report.freeze();
};
exports.checkProviders = checkProviders;
//# sourceMappingURL=provider.js.map