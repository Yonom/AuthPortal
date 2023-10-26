"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const zod_1 = require("zod");
// TODO duplicate
exports.Project = zod_1.z.object({
    admin_config: zod_1.z.object({
        name: zod_1.z.string(),
        members: zod_1.z.array(zod_1.z.string()),
    }),
    portal_config: zod_1.z.object({
        providers: zod_1.z.array(zod_1.z.object({
            provider_id: zod_1.z.string(),
        })),
        firebase_config: zod_1.z.record(zod_1.z.string()),
        theme: zod_1.z
            .object({
            primary_color: zod_1.z.string().optional(),
        })
            .optional(),
    }),
    clients: zod_1.z.record(zod_1.z.object({
        redirect_uris: zod_1.z.array(zod_1.z.string()),
    })),
});
//# sourceMappingURL=Project.js.map