import { onDocumentDeleted } from "firebase-functions/v2/firestore";

export const handleDomainDelete = onDocumentDeleted(
  "domains/{domain}",
  async (request) => {
    const { API_KEY } = process.env;
    if (!API_KEY) {
      throw new Error("API_KEY is not set");
    }

    const url = new URL("https://portal-api.authportal.dev/api/config");
    url.searchParams.set("domain", request.params.domain);
    await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });
  },
);
