import "./globalOptions";

import { initializeApp } from "firebase-admin/app";
initializeApp();

export { syncProjectsToCloudflare } from "./functions/syncProjectsToCloudflare";
export { runDoctor } from "./functions/runDoctor";
export { handleProjectDelete } from "./functions/handleProjectDelete";
export { handleDomainDelete } from "./functions/handleDomainDelete";
