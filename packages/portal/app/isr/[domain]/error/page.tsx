import { z } from "zod";
import { AuthPortalError, ErrorView } from "../AuthPortalError";

const ErrorSearchParams = z.object({
  error: z.string(),
  error_description: z.string(),
  error_uri: z.string().optional(),
});

const ErrorPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const { error, error_description, error_uri } =
    ErrorSearchParams.parse(searchParams);
  const err = new AuthPortalError(error, error_description, error_uri);
  return <ErrorView error={err} />;
};

export default ErrorPage;
