import { firestore } from "firebase-admin";
import { Project } from "./Project";

export type Domain = {
  domain: string;
  helper_domain?: string;
};

export const getDomains = (projectId: string) => {
  return firestore()
    .collection("domains")
    .where("project_id", "==", projectId)
    .get()
    .then((snap) =>
      snap.docs.map((d) => ({ domain: d.id, ...d.data() }) as Domain),
    );
};

export const getHelperDomain = (project: Project, domain: Domain) => {
  return (
    domain.helper_domain ?? project.portal_config.firebase_config.authDomain
  );
};

export const getHelperDomains = (project: Project, domains: Domain[]) => {
  const helperDomains = {} as Record<string, string[]>;
  for (const domain of domains) {
    const helperDomain = getHelperDomain(project, domain);
    if (!helperDomains[helperDomain]) {
      helperDomains[helperDomain] = [domain.domain];
    } else {
      helperDomains[helperDomain].push(domain.domain);
    }
  }
  return helperDomains;
};
