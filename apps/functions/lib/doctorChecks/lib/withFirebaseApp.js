"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withFirebaseApp = void 0;
const app_1 = require("firebase/app");
const withFirebaseApp = async (project, callback) => {
    const app = (0, app_1.initializeApp)(project.portal_config.firebase_config, Math.random().toString());
    try {
        return await callback(app);
    }
    finally {
        (0, app_1.deleteApp)(app);
    }
};
exports.withFirebaseApp = withFirebaseApp;
//# sourceMappingURL=withFirebaseApp.js.map