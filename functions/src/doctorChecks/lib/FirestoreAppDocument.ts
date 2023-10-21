import { z } from "zod";

// TODO duplicate
export const FirestoreAppDocument = z.object({
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

export type FirestoreAppDocument = z.infer<typeof FirestoreAppDocument>;
