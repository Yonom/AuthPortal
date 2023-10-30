import { Project } from "@authportal/db-types/firestore/project";
import { DomainWithId } from "@authportal/db-types/firestore/domain";
import { firestore } from "firebase-admin";

export const getDomains = (projectId: string) => {
  return firestore()
    .collection("domains")
    .where("project_id", "==", projectId)
    .get()
    .then((snap) =>
      snap.docs.map((d) => ({ domain: d.id, ...d.data() }) as DomainWithId),
    );
};

export const getHelperDomain = (project: Project, domain: DomainWithId) => {
  return (
    domain.helper_domain ?? project.portal_config.firebase_config.authDomain
  );
};

export const getHelperDomains = (project: Project, domains: DomainWithId[]) => {
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
