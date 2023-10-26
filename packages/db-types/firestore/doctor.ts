import { Timestamp } from "@firebase/firestore";
import { z } from "zod";

export type DoctorMessage =
  | {
      type:
        | "config/missing"
        | "config/malformed"
        | "config/invalid-api-key"
        | "config/auth-not-enabled"
        | "provider/none-configured"
        | "domain/none-configured"
        | "client/none-configured";
    }
  | {
      type: "internal-error";
      message: string;
      stack?: string;
    }
  | {
      type: "provider/not-enabled";
      provider_id: string;
    }
  | {
      type:
        | "domain/not-whitelisted-for-oauth"
        | "domain/helper-domain-mismatch";
      domain: string;
    }
  | {
      type: "provider/redirect-uri-not-whitelisted";
      domain: string;
      helper_domain: string;
      provider_id: string;
    }
  | {
      type: "client/no-redirect-uris";
      client_id: string;
    };

export const DoctorReport = z.object({
  messages: z.array(z.custom<DoctorMessage>()),
  created_at: z.custom<Timestamp>(),
});

export type DoctorReport = z.infer<typeof DoctorReport>;

export const Project = z.object({
  admin_config: z.object({
    name: z.string(),
    members: z.array(z.string()),
  }),
  portal_config: z.object({
    providers: z.array(
      z.object({
        provider_id: z.string(),
      }),
    ),
    firebase_config: z.record(z.string()),
    theme: z
      .object({
        primary_color: z.string().optional(),
      })
      .optional(),
  }),
  clients: z.record(
    z.object({
      redirect_uris: z.array(z.string()),
    }),
  ),
});

export type Project = z.infer<typeof Project>;
