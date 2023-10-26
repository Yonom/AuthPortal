import { AuthErrorCodes } from "firebase/auth";

export const ErrorMessages = {
  [AuthErrorCodes.INVALID_EMAIL]: "Invalid email address",
  [AuthErrorCodes.USER_DISABLED]: "This account has been disabled",
  [AuthErrorCodes.INVALID_PASSWORD]: "Incorrect password",
  [AuthErrorCodes.EMAIL_EXISTS]:
    "An account with this email address already exists",
  [AuthErrorCodes.WEAK_PASSWORD]: "Password is too weak",
  [AuthErrorCodes.CREDENTIAL_TOO_OLD_LOGIN_AGAIN]:
    "This operation is sensitive and requires recent authentication. Log in again before retrying this request.",
  [AuthErrorCodes.USER_MISMATCH]:
    "The supplied credentials do not correspond to the previously signed in user.",
  [AuthErrorCodes.CREDENTIAL_ALREADY_IN_USE]:
    "This credential is already associated with a different user account.",

  [AuthErrorCodes.USER_CANCELLED]:
    "Please authorize the required permissions to sign in to the application",
  [AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER]:
    "You have entered an incorrect password too many times. Please try again in a few minutes.",
  [AuthErrorCodes.USER_DELETED]:
    "That email address doesn't match an existing account",
  [AuthErrorCodes.NETWORK_REQUEST_FAILED]: "A network error has occurred.",
};
