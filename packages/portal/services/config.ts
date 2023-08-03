import { getDb } from "./db";

export const getConfig = async (domain: string) => {
  const db = await getDb();
  const res = await db.config.get(domain);
  if (!res) throw new Error("Invalid domain");

  return res;
};
