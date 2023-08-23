import {
  _InitConfig,
  _Config,
  _normalizeConfig,
} from "@authportal/core/config/normalization";
import { _signInWithRedirect } from "@authportal/core/signIn/redirect/signInWithRedirect";
import { _handleRedirect } from "@authportal/core/signIn/redirect/handleRedirect";
import { _signInWithPopup } from "@authportal/core/signIn/popup/signInWithPopup";
import { Auth, User } from "@firebase/auth";
import { _castAuth, UserImpl } from "@firebase/auth/internal";
import { _FirebasePayload } from "@authportal/core/signIn/utils/portalApi";

export type AuthPortalPopupResult = {
  user: User;
};

export type AuthPortalRedirectResult = {
  user: User;
  return_to: string;
};

export type GetAuthPortalRedirectResultConfig = {
  current_url?: string;
};

export type SignInWithAuthPortalConfig = {
  return_to?: string;
};

type _FirebaseConfig = {
  firebase_auth: Auth;
};

type _AuthPortalConfig = _Config & _FirebaseConfig;
export type AuthPortalInitConfig = _InitConfig & _FirebaseConfig;

export class AuthPortal {
  private readonly _config: _AuthPortalConfig;
  constructor(config: AuthPortalInitConfig) {
    this._config = _normalizeConfig<_FirebaseConfig>(config);
  }

  private async _signInWithFirebasePayload(
    firebase_auth: Auth,
    payload: _FirebasePayload,
  ) {
    const authInternal = _castAuth(firebase_auth);
    const user = UserImpl._fromJSON(authInternal, payload.firebase_user);
    await authInternal.updateCurrentUser(user);

    return user;
  }

  async getRedirectResult({
    current_url,
  }: GetAuthPortalRedirectResultConfig = {}): Promise<AuthPortalRedirectResult> {
    if (typeof window === "undefined")
      throw new Error(
        "You tried to call authPortal.getRedirectResult method on the server. This is not supported.",
      );

    const { client_id, domain, firebase_auth } = this._config;
    const { payload, return_to } = await _handleRedirect(
      domain,
      client_id,
      current_url ?? window.location.href,
    );
    const user = await this._signInWithFirebasePayload(firebase_auth, payload);

    return { user, return_to };
  }

  async signInWithRedirect(): Promise<void>;
  async signInWithRedirect(config?: SignInWithAuthPortalConfig): Promise<void> {
    if (typeof window === "undefined")
      throw new Error(
        "You tried to call authPortal.signInWithRedirect method on the server. This is not supported.",
      );

    const { client_id, domain, redirect_uri } = this._config;
    if (!redirect_uri)
      throw new Error(
        "redirect_uri is required. You can set it in the constructor of AuthPortal.",
      );

    return _signInWithRedirect(
      domain,
      client_id,
      redirect_uri,
      "firebase_auth",
      config?.return_to,
    );
  }

  async signInWithPopup(): Promise<AuthPortalPopupResult> {
    if (typeof window === "undefined")
      throw new Error(
        "You tried to call authPortal.signInWithRedirect method on the server. This is not supported.",
      );

    const { client_id, domain, firebase_auth } = this._config;
    const { payload } = await _signInWithPopup(
      domain,
      client_id,
      "firebase_auth",
    );
    const user = await this._signInWithFirebasePayload(firebase_auth, payload);
    return { user };
  }
}
