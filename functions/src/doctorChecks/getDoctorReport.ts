import { DoctorReport } from "./lib/DoctorReport";
import { FirestoreAppDocument } from "./lib/FirestoreAppDocument";
import { checkFirebaseConfigSchema, checkFirebaseConfig } from "./config";
import { getDomains } from "./lib/Domain";
import { checkClients } from "./client";
import { checkDomains } from "./domain";
import { ensureHasProviders, checkProviders } from "./provider";

const checkDocSchema = (appDoc: FirestoreAppDocument) => {
  const res = FirestoreAppDocument.safeParse(appDoc);
  if (res.success) return DoctorReport.EMPTY;

  return DoctorReport.fromMessage({
    type: "internal-error",
    message: `App document is invalid: ${res.error.message}`,
  });
};

export const getDoctorReport = async (
  appId: string,
  appDoc: FirestoreAppDocument,
) => {
  const domains = await getDomains(appId);

  const report = new DoctorReport();
  try {
    report
      .concat(checkDocSchema(appDoc))
      // config/*
      .concat(checkFirebaseConfigSchema(appDoc))
      .concat(await checkFirebaseConfig(appDoc))
      // provider/*
      .concat(ensureHasProviders(appDoc))
      .concat(await checkProviders(appDoc, domains))
      // domain/*
      .concat(await checkDomains(appDoc, domains))
      // client/*
      .concat(checkClients(appDoc));
  } catch (ex: unknown) {
    if (ex instanceof DoctorReport) {
      report.concat(ex);
    } else {
      report.addMessage({
        type: "internal-error",
        message: `Unhandled error: ${ex}`,
        stack: (ex as Error).stack,
      });
    }
  }

  return report.freeze();
};
