"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleDomainDelete = exports.handleProjectDelete = exports.runDoctor = exports.syncProjectsToCloudflare = void 0;
const app_1 = require("firebase-admin/app");
const v2_1 = require("firebase-functions/v2");
(0, v2_1.setGlobalOptions)({ maxInstances: 10 });
(0, app_1.initializeApp)();
var syncProjectsToCloudflare_1 = require("./functions/syncProjectsToCloudflare");
Object.defineProperty(exports, "syncProjectsToCloudflare", { enumerable: true, get: function () { return syncProjectsToCloudflare_1.syncProjectsToCloudflare; } });
var runDoctor_1 = require("./functions/runDoctor");
Object.defineProperty(exports, "runDoctor", { enumerable: true, get: function () { return runDoctor_1.runDoctor; } });
var handleProjectDelete_1 = require("./functions/handleProjectDelete");
Object.defineProperty(exports, "handleProjectDelete", { enumerable: true, get: function () { return handleProjectDelete_1.handleProjectDelete; } });
var handleDomainDelete_1 = require("./functions/handleDomainDelete");
Object.defineProperty(exports, "handleDomainDelete", { enumerable: true, get: function () { return handleDomainDelete_1.handleDomainDelete; } });
//# sourceMappingURL=index.js.map