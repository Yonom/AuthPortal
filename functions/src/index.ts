import { initializeApp } from "firebase-admin/app";
import { setGlobalOptions } from "firebase-functions/v2";

setGlobalOptions({ maxInstances: 10 });
initializeApp();

export { syncAppsToCloudflare } from "./cloudflare-sync";
export { runDoctor } from "./doctor";
