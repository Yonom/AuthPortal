import {
  InitAuthPortalConfig,
  _AuthPortalConfig,
  _normalizeConfig,
} from "@authportal/core/utils/config";
import { _signInWithAuthPortal } from "@authportal/core/redirect/signInWithAuthPortal";
import { _handleAuthPortalRedirect } from "@authportal/core/redirect/handleAuthPortalRedirect";
import { Auth, User } from "@firebase/auth";
import { _castAuth, UserImpl } from "@firebase/auth/internal";

export type AuthPortalRedirectResult = {
  user: User;
  return_to: string;
};

export type GetAuthPortalRedirectResultConfig = {
  firebase_auth: Auth;
  current_url?: string;
};

export type SignInWithAuthPortalConfig = {
  return_to?: string;
};

export class AuthPortal {
  private readonly _config: _AuthPortalConfig;
  constructor(config: InitAuthPortalConfig) {
    this._config = _normalizeConfig(config);
  }

  async getRedirectResult({
    firebase_auth,
    current_url,
  }: GetAuthPortalRedirectResultConfig): Promise<AuthPortalRedirectResult> {
    if (typeof window === "undefined")
      throw new Error(
        "You tried to call authPortal.getRedirectResult method on the server. This is not supported."
      );

    const redirectResult = await _handleAuthPortalRedirect(
      this._config.domain,
      this._config.client_id,
      current_url ?? window.location.href
    );

    const authInternal = _castAuth(firebase_auth);
    const user = UserImpl._fromJSON(
      authInternal,
      redirectResult.payload.firebase_user
    );
    await firebase_auth.updateCurrentUser(user);

    return {
      user,
      return_to: redirectResult.return_to,
    };
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
