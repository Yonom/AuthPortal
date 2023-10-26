import { z } from "zod";

export const FirebaseConfig = z
  .object({
    apiKey: z.string(),
    authDomain: z.string(),
    projectId: z.string(),
    storageBucket: z.string(),
    messagingSenderId: z.string(),
    appId: z.string(),
    measurementId: z.string().optional(),
  })
  .strict();

export type FirebaseConfig = z.infer<typeof FirebaseConfig>;
