import { initializeApp } from "firebase-admin/app";
import { setGlobalOptions } from "firebase-functions/v2";

setGlobalOptions({ maxInstances: 10 });
initializeApp();

export { syncAppsToCloudflare } from "./functions/syncAppsToCloudflare";
export { runDoctor } from "./functions/runDoctor";
export { handleAppDelete } from "./functions/handleAppDelete";
export { handleDomainDelete } from "./functions/handleDomainDelete";
