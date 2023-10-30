import { Timestamp } from "@firebase/firestore";
import { z } from "zod";

const FirestoreDomainDocument = z.object({
  project_id: z.string(),
  helper_domain: z.string().optional(),
  created_at: z.custom<Timestamp>().nullable(),
  updated_at: z.custom<Timestamp>().nullable(),
});

export type FirestoreDomainDocument = z.infer<typeof FirestoreDomainDocument>;

export type DomainWithId = FirestoreDomainDocument & {
  domain: string;
};
