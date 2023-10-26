"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkFirebaseConfig = exports.checkFirebaseConfigSchema = void 0;
const zod_1 = require("zod");
const DoctorReport_1 = require("./lib/DoctorReport");
const app_1 = require("firebase/app");
const auth_1 = require("firebase/auth");
const withFirebaseApp_1 = require("./lib/withFirebaseApp");
const FirebaseConfig = zod_1.z
    .object({
    apiKey: zod_1.z.string(),
    authDomain: zod_1.z.string(),
    projectId: zod_1.z.string(),
    storageBucket: zod_1.z.string(),
    messagingSenderId: zod_1.z.string(),
    appId: zod_1.z.string(),
    measurementId: zod_1.z.string().optional(),
})
    .strict();
const checkFirebaseConfigSchema = (project) => {
    if (Object.keys(project.portal_config.firebase_config).length === 0) {
        // fatal, throw
        throw DoctorReport_1.DoctorReport.fromMessage({
            type: "config/missing",
        });
    }
    const res = FirebaseConfig.safeParse(project.portal_config.firebase_config);
    if (res.success)
        return DoctorReport_1.DoctorReport.EMPTY;
    return DoctorReport_1.DoctorReport.fromMessage({
        type: "config/malformed",
    });
};
exports.checkFirebaseConfigSchema = checkFirebaseConfigSchema;
const checkFirebaseConfig = async (project) => {
    return (0, withFirebaseApp_1.withFirebaseApp)(project, async (app) => {
        try {
            const auth = (0, auth_1.getAuth)(app);
            await (0, auth_1.signInWithEmailAndPassword)(auth, "authportal-test@example.com", Math.random().toString());
            return DoctorReport_1.DoctorReport.EMPTY;
        }
        catch (ex) {
            if (!(ex instanceof app_1.FirebaseError))
                throw ex;
            const errorWhitelist = [
                "auth/operation-not-allowed",
                "auth/app-not-authorized",
                "auth/user-disabled",
                "auth/user-not-found",
                "auth/wrong-password",
                "auth/invalid-login-credentials",
            ];
            if (errorWhitelist.includes(ex.code)) {
                return DoctorReport_1.DoctorReport.EMPTY;
            }
            else if (ex.code === "auth/invalid-api-key" ||
                ex.code === "auth/api-key-not-valid.-please-pass-a-valid-api-key." // TODO investigate
            ) {
                // fatal, throw
                throw DoctorReport_1.DoctorReport.fromMessage({
                    type: "config/invalid-api-key",
                });
            }
            else if (ex.code === "auth/configuration-not-found") {
                // fatal, throw
                throw DoctorReport_1.DoctorReport.fromMessage({
                    type: "config/auth-not-enabled",
                });
            }
            else {
                // fatal, throw
                throw ex;
            }
        }
    });
};
exports.checkFirebaseConfig = checkFirebaseConfig;
//# sourceMappingURL=config.js.map