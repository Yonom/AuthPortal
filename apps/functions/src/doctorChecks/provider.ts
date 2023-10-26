import { FirebaseError } from "firebase/app";
import {
  Auth,
  EmailAuthProvider,
  GoogleAuthProvider,
  getAuth,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { DoctorReport } from "./lib/DoctorReport";
import { Project } from "./lib/Project";
import { Domain } from "./lib/Domain";
import { withFirebaseApp } from "./lib/withFirebaseApp";
import { getHelperDomains } from "./lib/Domain";

export const ensureHasProviders = (project: Project) => {
  const { providers } = project.portal_config;
  if (providers.length === 0) {
    return DoctorReport.fromMessage({
      type: "provider/none-configured",
    });
  }
  return DoctorReport.EMPTY;
};

const withProviderEnabledReport = async (
  project: Project,
  provider_id: string,
  callback: (auth: Auth) => Promise<unknown>,
) => {
  try {
    await withFirebaseApp(project, async (app) => {
      const auth = getAuth(app);
      await callback(auth);
    });
    return DoctorReport.EMPTY;
  } catch (ex: unknown) {
    if (!(ex instanceof FirebaseError)) throw ex;
    if (ex.code === "auth/operation-not-allowed") {
      return DoctorReport.fromMessage({
        type: "provider/not-enabled",
        provider_id,
      });
    } else {
      return DoctorReport.EMPTY;
    }
  }
};

const getAuthUri = async (project: Project, helperDomain: string) => {
  const url = new URL(
    "https://www.googleapis.com/identitytoolkit/v3/relyingparty/createAuthUri",
  );
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

const checkForGoogleRedirectToError = async (authUri: string) => {
  const res = await fetch(authUri, {
    redirect: "manual",
  });
  return res.headers
    .get("Location")
    ?.startsWith("https://accounts.google.com/signin/oauth/error");
};

const validateGoogleRedirectUri = async (
  project: Project,
  domains: Domain[],
) => {
  const helperDomains = getHelperDomains(project, domains);
  const report = new DoctorReport();
  for (const [helperDomain, domains] of Object.entries(helperDomains)) {
    try {
      const authUri = await getAuthUri(project, helperDomain);
      if (await checkForGoogleRedirectToError(authUri)) {
        for (const domain of domains) {
          report.addMessage({
            type: "provider/redirect-uri-not-whitelisted",
            helper_domain: helperDomain,
            domain,
            provider_id: GoogleAuthProvider.PROVIDER_ID,
          });
        }
      }
    } catch (ex) {
      report.addMessage({
        type: "internal-error",
        message: `Failed to validate redirect uri: ${ex}`,
        stack: (ex as Error).stack,
      });
    }
  }
  return report.freeze();
};

// const AppleAuthProvider = new OAuthProvider("apple.com");

const checkProvider = async (
  project: Project,
  provider: Project["portal_config"]["providers"][0],
  domains: Domain[],
) => {
  // TODO redirect uri validation for each provider
  const { provider_id } = provider;
  switch (provider_id) {
    case EmailAuthProvider.PROVIDER_ID: {
      return withProviderEnabledReport(project, provider_id, (auth) =>
        signInWithEmailAndPassword(
          auth,
          "authportal-test@example.com",
          Math.random().toString(),
        ),
      );
    }
    case GoogleAuthProvider.PROVIDER_ID: {
      const providerEnabled = await withProviderEnabledReport(
        project,
        provider_id,
        (auth) =>
          signInWithCredential(auth, GoogleAuthProvider.credential("-")),
      );
      if (providerEnabled.messages.length > 0) return providerEnabled;
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
      return DoctorReport.fromMessage({
        type: "internal-error",
        message: `Unknown provider: ${provider_id}`,
      });
  }
};

export const checkProviders = async (project: Project, domains: Domain[]) => {
  const report = new DoctorReport();
  const { providers } = project.portal_config;
  for (const provider of providers) {
    report.concat(await checkProvider(project, provider, domains));
  }
  return report.freeze();
};
