import { z } from "zod";

export const PortalConfig = z.object({
  firebase_config: z.record(z.string()),
  providers: z.array(z.object({ provider_id: z.string() })),
  theme: z.object({ primary_color: z.string().optional() }).optional(),
});

export type PortalConfig = z.infer<typeof PortalConfig>;

export const ConfigKVObject = z.object({
  portal_config: PortalConfig,
  clients: z.record(
    z.object({ name: z.string(), redirect_uris: z.string().array() }),
  ),
  updated_at: z.string(),
});

export type ConfigKVObject = z.infer<typeof ConfigKVObject>;
