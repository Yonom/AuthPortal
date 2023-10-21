import { firestore } from "firebase-admin";
import { FirestoreAppDocument } from "./FirestoreAppDocument";

export type Domain = {
  domain: string;
  helper_domain?: string;
};

export const getDomains = (appId: string) => {
  return firestore()
    .collection("domains")
    .where("app_id", "==", appId)
    .get()
    .then((snap) =>
      snap.docs.map((d) => ({ domain: d.id, ...d.data() }) as Domain),
    );
};

export const getHelperDomain = (
  appDoc: FirestoreAppDocument,
  domain: Domain,
) => {
  return (
    domain.helper_domain ?? appDoc.portal_config.firebase_config.authDomain
  );
};

export const getHelperDomains = (
  appDoc: FirestoreAppDocument,
  domains: Domain[],
) => {
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
