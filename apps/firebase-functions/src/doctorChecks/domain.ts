import { EmailAuthProvider } from "firebase/auth";
import { parse as pslParse } from "psl";
import { DoctorReport } from "./lib/DoctorReport";
import { getHelperDomain } from "./lib/Domain";
import { Project } from "@authportal/db-types/firestore/project";
import { DomainWithId } from "@authportal/db-types/firestore/domain";

const checkDomainWhitelist = async (
  project: Project,
  domains: DomainWithId[],
) => {
  const url = new URL("https://identitytoolkit.googleapis.com/v1/projects");
  url.searchParams.set("key", project.portal_config.firebase_config.apiKey);
  const res = await fetch(url);
  if (!res.ok) {
    return DoctorReport.fromMessage({
      type: "general/internal-error",
      message: `Failed to fetch identitytoolkit project config: ${res.status} ${res.statusText}`,
    });
  }

  const data = (await res.json()) as {
    authorizedDomains?: string[];
  };

  for (const { domain } of domains) {
    if (!data.authorizedDomains?.includes(domain)) {
      return DoctorReport.fromMessage({
        type: "domain/not-whitelisted-for-oauth",
        domain,
      });
    }
  }
  return DoctorReport.EMPTY;
};
const checkHelperDomain = (project: Project, domain: DomainWithId) => {
  const helperDomain = getHelperDomain(project, domain);

  // get the domain part of the authDomain (strip subdomains)
  const authPortalPslResult = pslParse(domain.domain);
  const helperPslResult = pslParse(helperDomain);
  if (authPortalPslResult.error || helperPslResult.error) {
    return DoctorReport.fromMessage({
      type: "general/internal-error",
      message: `Failed to parse authDomain: ${domain} or ${helperDomain}`,
    });
  }

  // report if the parent domains mismatch
  if (authPortalPslResult.domain !== helperPslResult.domain) {
    return DoctorReport.fromMessage({
      type: "domain/helper-domain-mismatch",
      domain: domain.domain,
    });
  }

  return DoctorReport.EMPTY;
};
export const checkDomains = async (
  project: Project,
  domains: DomainWithId[],
) => {
  // report if no domains are configured
  if (domains.length === 0) {
    return DoctorReport.fromMessage({
      type: "domain/none-configured",
    });
  }

  // if no oauth provider is configured, skip the next checks
  if (
    project.portal_config.providers.every(
      (p) => p.provider_id == EmailAuthProvider.PROVIDER_ID,
    )
  ) {
    return DoctorReport.EMPTY;
  }

  // check if domain is whitelisted for oauth
  const report = new DoctorReport();
  report.concat(await checkDomainWhitelist(project, domains));

  // check if helper domain is under the same domain
  for (const domain of domains) {
    report.concat(checkHelperDomain(project, domain));
  }

  // TODO dns records
  return report.freeze();
};
