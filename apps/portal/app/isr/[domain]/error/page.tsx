"use client";

import { z } from "zod";
import { AuthPortalError, ErrorView } from "../AuthPortalError";
import { useSearchParams } from "next/navigation";

const ErrorSearchParams = z
  .object({
    error: z.string(),
    error_description: z.string(),
    error_uri: z.string().optional(),
  })
  .strict();

const ErrorPage = () => {
  const searchParams = useSearchParams();
  const { error, error_description, error_uri } = ErrorSearchParams.parse(
    Object.fromEntries(searchParams)
  );
  const err = new AuthPortalError(error, error_description, error_uri);
  return <ErrorView error={err} />;
};

export default ErrorPage;
