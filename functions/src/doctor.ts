import { firestore } from "firebase-admin";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import {
  FirebaseApp,
  FirebaseError,
  deleteApp,
  initializeApp,
} from "firebase/app";
import {
  Auth,
  EmailAuthProvider,
  GoogleAuthProvider,
  getAuth,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { z } from "zod";
import { parse as pslParse } from "psl";

type DoctorMessage =
  | {
      id:
        | "config/missing"
        | "config/malformed"
        | "config/invalid-api-key"
        | "config/auth-not-enabled"
        | "provider/none-configured"
        | "domain/none-configured";
    }
  | {
      id: "internal-error";
      message: string;
      stack?: string;
    }
  | {
      id: "provider/not-enabled";
      provider_id: string;
    }
  | {
      id: "domain/not-whitelisted-for-oauth" | "domain/helper-domain-mismatch";
      domain: string;
    }
  | {
      id: "provider/redirect-uri-not-whitelisted";
      domain: string;
      helper_domain: string;
      provider_id: string;
    };

class DoctorReport {
  messages: Readonly<DoctorMessage>[] = [];

  addMessage(message: DoctorMessage) {
    this.messages.push(Object.freeze(message));
    return this;
  }

  concat(report: DoctorReport) {
    this.messages = this.messages.concat(report.messages);
    return this;
  }

  freeze() {
    Object.freeze(this.messages);
    Object.freeze(this);

    return this;
  }

  static fromMessage(message: DoctorMessage) {
    return new DoctorReport().addMessage(message).freeze();
  }

  static EMPTY = new DoctorReport().freeze();
}

const FirestoreAppDocument = z.object({
  admin_config: z.object({
    name: z.string(),
    members: z.array(z.string()),
  }),
  portal_config: z.object({
    providers: z.array(
      z.object({
        provider_id: z.string(),
      }),
    ),
    firebase_config: z.record(z.string()),
  }),
  clients: z.record(
    z.object({
      redirect_uris: z.array(z.string()),
    }),
  ),
});

const FirebaseConfig = z
  .object({
    apiKey: z.string(),
    authDomain: z.string(),
    projectId: z.string(),
    storageBucket: z.string(),
    messagingSenderId: z.string(),
    appId: z.string(),
    measurementId: z.string().optional(),
  })
  .strict();

type FirestoreAppDocument = z.infer<typeof FirestoreAppDocument>;

const withFirebaseApp = async <T>(
  appDoc: FirestoreAppDocument,
  callback: (app: FirebaseApp) => Promise<T>,
): Promise<T> => {
  const app = initializeApp(
    appDoc.portal_config.firebase_config,
    Math.random().toString(),
  );

  try {
    return await callback(app);
  } finally {
    deleteApp(app);
  }
};

const checkFirebaseConfig = async (appDoc: FirestoreAppDocument) => {
  return withFirebaseApp(appDoc, async (app) => {
    try {
      const auth = getAuth(app);
      await signInWithEmailAndPassword(
        auth,
        "authportal-test@example.com",
        Math.random().toString(),
      );
      return DoctorReport.EMPTY;
    } catch (ex: unknown) {
      if (!(ex instanceof FirebaseError)) throw ex;
      const errorWhitelist = [
        "auth/operation-not-allowed",
        "auth/app-not-authorized",
        "auth/user-disabled",
        "auth/user-not-found",
        "auth/wrong-password",
        "auth/invalid-login-credentials",
      ];
      if (errorWhitelist.includes(ex.code)) {
        return DoctorReport.EMPTY;
      } else if (ex.code === "auth/invalid-api-key") {
        // fatal, throw
        throw DoctorReport.fromMessage({
          id: "config/invalid-api-key",
        });
      } else if (ex.code === "auth/configuration-not-found") {
        // fatal, throw
        throw DoctorReport.fromMessage({
          id: "config/auth-not-enabled",
        });
      } else {
        // fatal, throw
        throw ex;
      }
    }
  });
};

const checkDocSchema = (appDoc: FirestoreAppDocument) => {
  const res = FirestoreAppDocument.safeParse(appDoc);
  if (res.success) return DoctorReport.EMPTY;

  return DoctorReport.fromMessage({
    id: "internal-error",
    message: `App document is invalid: ${res.error.message}`,
  });
};

const checkFirebaseConfigSchema = (appDoc: FirestoreAppDocument) => {
  if (Object.keys(appDoc.portal_config.firebase_config).length === 0) {
    // fatal, throw
    throw DoctorReport.fromMessage({
      id: "config/missing",
    });
  }

  const res = FirebaseConfig.safeParse(appDoc.portal_config.firebase_config);
  if (res.success) return DoctorReport.EMPTY;

  return DoctorReport.fromMessage({
    id: "config/malformed",
  });
};

const ensureHasProviders = (appDoc: FirestoreAppDocument) => {
  const { providers } = appDoc.portal_config;
  if (providers.length === 0) {
    return DoctorReport.fromMessage({
      id: "provider/none-configured",
    });
  }
  return DoctorReport.EMPTY;
};

const withProviderEnabledReport = async (
  appDoc: FirestoreAppDocument,
  provider_id: string,
  callback: (auth: Auth) => Promise<unknown>,
) => {
  try {
    await withFirebaseApp(appDoc, async (app) => {
      const auth = getAuth(app);
      await callback(auth);
    });
    return DoctorReport.EMPTY;
  } catch (ex: unknown) {
    if (!(ex instanceof FirebaseError)) throw ex;
    if (ex.code === "auth/operation-not-allowed") {
      return DoctorReport.fromMessage({
        id: "provider/not-enabled",
        provider_id,
      });
    } else {
      return DoctorReport.EMPTY;
    }
  }
};

const getHelperDomains = (appDoc: FirestoreAppDocument, domains: Domain[]) => {
  const helperDomains = {} as Record<string, string[]>;
  for (const domain of domains) {
    const helperDomain = getHelperDomain(appDoc, domain);
    if (!helperDomains[helperDomain]) {
      helperDomains[helperDomain] = [domain.domain];
    } else {
      helperDomains[helperDomain].push(domain.domain);
    }
  }
  return helperDomains;
};

const getAuthUri = async (
  appDoc: FirestoreAppDocument,
  helperDomain: string,
) => {
  const url = new URL(
    "https://www.googleapis.com/identitytoolkit/v3/relyingparty/createAuthUri",
  );
  url.searchParams.set("key", appDoc.portal_config.firebase_config.apiKey);
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
  appDoc: FirestoreAppDocument,
  domains: Domain[],
) => {
  const helperDomains = getHelperDomains(appDoc, domains);
  const report = new DoctorReport();
  for (const [helperDomain, domains] of Object.entries(helperDomains)) {
    try {
      const authUri = await getAuthUri(appDoc, helperDomain);
      if (await checkForGoogleRedirectToError(authUri)) {
        for (const domain of domains) {
          report.addMessage({
            id: "provider/redirect-uri-not-whitelisted",
            helper_domain: helperDomain,
            domain,
            provider_id: GoogleAuthProvider.PROVIDER_ID,
          });
        }
      }
    } catch (ex) {
      report.addMessage({
        id: "internal-error",
        message: `Failed to validate redirect uri: ${ex}`,
      });
    }
  }
  return report.freeze();
};

// const AppleAuthProvider = new OAuthProvider("apple.com");

const checkProvider = async (
  appDoc: FirestoreAppDocument,
  provider: FirestoreAppDocument["portal_config"]["providers"][0],
  domains: Domain[],
) => {
  // TODO redirect uri validation for each provider

  const { provider_id } = provider;
  switch (provider_id) {
    case EmailAuthProvider.PROVIDER_ID: {
      return withProviderEnabledReport(appDoc, provider_id, (auth) =>
        signInWithEmailAndPassword(
          auth,
          "authportal-test@example.com",
          Math.random().toString(),
        ),
      );
    }
    case GoogleAuthProvider.PROVIDER_ID: {
      const providerEnabled = await withProviderEnabledReport(
        appDoc,
        provider_id,
        (auth) =>
          signInWithCredential(auth, GoogleAuthProvider.credential("-")),
      );
      if (providerEnabled.messages.length > 0) return providerEnabled;
      return validateGoogleRedirectUri(appDoc, domains);
    }
    // case FacebookAuthProvider.PROVIDER_ID:
    //   return withProviderEnabledReport(appDoc, provider_id, (auth) =>
    //     signInWithCredential(auth, FacebookAuthProvider.credential("-")),
    //   );
    // case GithubAuthProvider.PROVIDER_ID:
    //   return withProviderEnabledReport(appDoc, provider_id, (auth) =>
    //     signInWithCredential(auth, GithubAuthProvider.credential("-")),
    //   );
    // case AppleAuthProvider.providerId:
    //   return withProviderEnabledReport(appDoc, provider_id, (auth) =>
    //     signInWithCredential(
    //       auth,
    //       AppleAuthProvider.credential({ idToken: "-" }),
    //     ),
    //   );
    default:
      return DoctorReport.fromMessage({
        id: "internal-error",
        message: `Unknown provider: ${provider_id}`,
      });
  }
};

const checkProviders = async (
  appDoc: FirestoreAppDocument,
  domains: Domain[],
) => {
  const report = new DoctorReport();
  const { providers } = appDoc.portal_config;
  for (const provider of providers) {
    report.concat(await checkProvider(appDoc, provider, domains));
  }
  return report.freeze();
};

type Domain = {
  domain: string;
  helper_domain?: string;
};

const checkDomainWhitelist = async (
  appDoc: FirestoreAppDocument,
  domains: Domain[],
) => {
  const url = new URL("https://identitytoolkit.googleapis.com/v1/projects");
  url.searchParams.set("key", appDoc.portal_config.firebase_config.apiKey);
  const res = await fetch(url);
  if (!res.ok) {
    return DoctorReport.fromMessage({
      id: "internal-error",
      message: `Failed to fetch identitytoolkit project config: ${res.status} ${res.statusText}`,
    });
  }

  const data = (await res.json()) as {
    authorizedDomains?: string[];
  };

  for (const { domain } of domains) {
    if (!data.authorizedDomains?.includes(domain)) {
      return DoctorReport.fromMessage({
        id: "domain/not-whitelisted-for-oauth",
        domain,
      });
    }
  }
  return DoctorReport.EMPTY;
};

const getHelperDomain = (appDoc: FirestoreAppDocument, domain: Domain) => {
  return (
    domain.helper_domain ?? appDoc.portal_config.firebase_config.authDomain
  );
};

const checkHelperDomain = (appDoc: FirestoreAppDocument, domain: Domain) => {
  const helperDomain = getHelperDomain(appDoc, domain);

  // get the domain part of the authDomain (strip subdomains)
  const authPortalPslResult = pslParse(domain.domain);
  const helperPslResult = pslParse(helperDomain);
  if (authPortalPslResult.error || helperPslResult.error) {
    return DoctorReport.fromMessage({
      id: "internal-error",
      message: `Failed to parse authDomain: ${domain} or ${helperDomain}`,
    });
  }

  // report if the parent domains mismatch
  if (authPortalPslResult.domain !== helperPslResult.domain) {
    return DoctorReport.fromMessage({
      id: "domain/helper-domain-mismatch",
      domain: domain.domain,
    });
  }

  return DoctorReport.EMPTY;
};

const checkDomains = async (
  appDoc: FirestoreAppDocument,
  domains: Domain[],
) => {
  // report if no domains are configured
  if (domains.length === 0) {
    return DoctorReport.fromMessage({
      id: "domain/none-configured",
    });
  }

  // if no oauth provider is configured, skip the next checks
  if (
    appDoc.portal_config.providers.every(
      (p) => p.provider_id == EmailAuthProvider.PROVIDER_ID,
    )
  ) {
    return DoctorReport.EMPTY;
  }

  // check if domain is whitelisted for oauth
  const report = new DoctorReport();
  report.concat(await checkDomainWhitelist(appDoc, domains));

  // check if helper domain is under the same domain
  for (const domain of domains) {
    report.concat(checkHelperDomain(appDoc, domain));
  }

  // TODO dns records

  return report.freeze();
};

const getDoctorReport = async (appId: string, appDoc: FirestoreAppDocument) => {
  const domains = await firestore()
    .collection("domains")
    .where("app_id", "==", appId)
    .get()
    .then((snap) =>
      snap.docs.map((d) => ({ domain: d.id, ...d.data() }) as Domain),
    );

  const report = new DoctorReport();
  try {
    report
      .concat(checkDocSchema(appDoc))
      .concat(checkFirebaseConfigSchema(appDoc))
      .concat(await checkFirebaseConfig(appDoc))
      .concat(ensureHasProviders(appDoc))
      .concat(await checkProviders(appDoc, domains))
      .concat(await checkDomains(appDoc, domains));
  } catch (ex: unknown) {
    if (ex instanceof DoctorReport) {
      report.concat(ex);
    } else {
      report.addMessage({
        id: "internal-error",
        message: `Internal error: ${ex}`,
        stack: (ex as Error).stack,
      });
    }
  }

  return report.freeze();
};

export const runDoctor = onDocumentWritten("apps/{app_id}", async (request) => {
  const data = request.data?.after.data();
  if (!data) return;

  const report = await getDoctorReport(
    request.params.app_id,
    data as FirestoreAppDocument,
  );
  firestore().doc(`apps/${request.params.app_id}/metadata/doctor_report`).set({
    messages: report.messages,
    created_at: firestore.FieldValue.serverTimestamp(),
  });
});

// TODO test cases
// TODO whitelist OAauth domain
