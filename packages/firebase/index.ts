import { _AuthPortalConfig } from "@authportal/core/utils/config";

export type SignInWithAuthPortalConfig = {
  return_to?: string;
};

export class AuthPortal {
  private readonly _config: _AuthPortalConfig;
  constructor(config: _AuthPortalConfig) {
    this._config = config;
  }

  async signInWithRedirect(): Promise<void>;
  async signInWithRedirect(config?: SignInWithAuthPortalConfig): Promise<void> {
    if (typeof window === "undefined")
      throw new Error(
        "You tried to call authPortal.signInWithRedirect method on the server. This is not supported."
      );

    return _signInWithAuthPortal(this._config, {
      return_to: config?.return_to,
      scope: "firebase_auth",
    });
  }
}
