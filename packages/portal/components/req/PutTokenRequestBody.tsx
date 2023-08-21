import { z } from "zod";
import { ReqParams } from "./reqEncryption";

export const PutTokenRequestBody = ReqParams.extend({
  payload: z
    .object({
      firebase_user: z.record(z.unknown()),
    })
    .strict(),
}).strict();

export type PutTokenRequestBody = z.infer<typeof PutTokenRequestBody>;
