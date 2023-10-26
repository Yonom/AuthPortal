import { initializeApp } from "firebase-admin/app";
import { setGlobalOptions } from "firebase-functions/v2";

setGlobalOptions({ maxInstances: 10 });
initializeApp();

export { syncProjectsToCloudflare } from "./functions/syncProjectsToCloudflare";
export { runDoctor } from "./functions/runDoctor";
export { handleProjectDelete } from "./functions/handleProjectDelete";
export { handleDomainDelete } from "./functions/handleDomainDelete";
