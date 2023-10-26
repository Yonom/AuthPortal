import { DoctorReport } from "./lib/DoctorReport";
import { checkFirebaseConfigSchema, checkFirebaseConfig } from "./config";
import { getDomains } from "./lib/Domain";
import { checkClients } from "./client";
import { checkDomains } from "./domain";
import { ensureHasProviders, checkProviders } from "./provider";

const checkProjectSchema = (project: Project) => {
  const res = Project.safeParse(project);
  if (res.success) return DoctorReport.EMPTY;

  return DoctorReport.fromMessage({
    type: "internal-error",
    message: `Project document is invalid: ${res.error.message}`,
  });
};

export const getDoctorReport = async (projectId: string, project: Project) => {
  const domains = await getDomains(projectId);

  const report = new DoctorReport();
  try {
    report
      .concat(checkProjectSchema(project))
      // config/*
      .concat(checkFirebaseConfigSchema(project))
      .concat(await checkFirebaseConfig(project))
      // provider/*
      .concat(ensureHasProviders(project))
      .concat(await checkProviders(project, domains))
      // domain/*
      .concat(await checkDomains(project, domains))
      // client/*
      .concat(checkClients(project));
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
