import { FC } from "react";

export class AuthPortalError extends Error {
  constructor(
    name: string,
    message: string,
    public error_uri?: string
  ) {
    super(message);
    this.name = name;
  }
}

type ErrorViewProps = {
  error: Error;
};

export const ErrorView: FC<ErrorViewProps> = ({ error }) => {
  if (error instanceof AuthPortalError) {
    return (
      <div>
        error! {error.message} {error.error_uri}
      </div>
    );
  }

  return <div>error! {error.message}</div>;
};

export const UNKNOWN_ERROR = () =>
  new AuthPortalError(
    "unknown_error",
    "An unknown error occurred. Please try again later."
  );

export const REDIRECT_FAILED_ERROR = () =>
  new AuthPortalError(
    "redirect_failed",
    "Redirect failed. Ensure that that third-party cookies are enabled."
  );

export const getErrorPath = (error: Error) => {
  const authportalError =
    error instanceof AuthPortalError ? error : UNKNOWN_ERROR();

  const url = new URL("/error", window.location.origin);
  url.searchParams.set("error", authportalError.name);
  url.searchParams.set("error_description", authportalError.message);
  if (authportalError.error_uri) {
    url.searchParams.set("error_uri", authportalError.error_uri);
  }
  return url.href;
};
