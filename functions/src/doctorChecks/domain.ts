import { EmailAuthProvider } from "firebase/auth";
import { parse as pslParse } from "psl";
import { DoctorReport } from "./lib/DoctorReport";
import { FirestoreAppDocument } from "./lib/FirestoreAppDocument";
import { Domain } from "./lib/Domain";
import { getHelperDomain } from "./lib/Domain";

const checkDomainWhitelist = async (
  appDoc: FirestoreAppDocument,
  domains: Domain[],
) => {
  const url = new URL("https://identitytoolkit.googleapis.com/v1/projects");
  url.searchParams.set("key", appDoc.portal_config.firebase_config.apiKey);
  const res = await fetch(url);
  if (!res.ok) {
    return DoctorReport.fromMessage({
      type: "internal-error",
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
const checkHelperDomain = (appDoc: FirestoreAppDocument, domain: Domain) => {
  const helperDomain = getHelperDomain(appDoc, domain);

  // get the domain part of the authDomain (strip subdomains)
  const authPortalPslResult = pslParse(domain.domain);
  const helperPslResult = pslParse(helperDomain);
  if (authPortalPslResult.error || helperPslResult.error) {
    return DoctorReport.fromMessage({
      type: "internal-error",
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
  appDoc: FirestoreAppDocument,
  domains: Domain[],
) => {
  // report if no domains are configured
  if (domains.length === 0) {
    return DoctorReport.fromMessage({
      type: "domain/none-configured",
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