import { z } from "zod";

const FirebasePayload = z.object({
  firebase_user: z.record(z.unknown()),
});

export type FirebasePayload = z.infer<typeof FirebasePayload>;

export const PayloadKVObject = z.object({
  code_challenge: z.string(),
  redirect_uri: z.string(),
  payload: FirebasePayload,
});

export type PayloadKVObject = z.infer<typeof PayloadKVObject>;
