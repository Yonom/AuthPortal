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
import { FirebasePayload } from "@authportal/db-types/cloudflare/payload";

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

export type SignInWithPopupConfig = {
  screen_hint?: "signup";
};

export type SignInWithRedirectConfig = {
  screen_hint?: "signup";
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

    // bind methods
    this.getRedirectResult = this.getRedirectResult.bind(this);
    this.signInWithRedirect = this.signInWithRedirect.bind(this);
    this.signInWithPopup = this.signInWithPopup.bind(this);
  }

  private async _signInWithFirebasePayload(
    firebase_auth: Auth,
    payload: FirebasePayload,
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
  async signInWithRedirect(config: SignInWithRedirectConfig): Promise<void>;
  async signInWithRedirect(config?: SignInWithRedirectConfig): Promise<void> {
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
      config?.screen_hint,
      config?.return_to,
    );
  }

  async signInWithPopup(): Promise<AuthPortalPopupResult>;
  async signInWithPopup(
    config: SignInWithPopupConfig,
  ): Promise<AuthPortalPopupResult>;
  async signInWithPopup(
    config?: SignInWithPopupConfig,
  ): Promise<AuthPortalPopupResult> {
    if (typeof window === "undefined")
      throw new Error(
        "You tried to call authPortal.signInWithRedirect method on the server. This is not supported.",
      );

    const { client_id, domain, firebase_auth } = this._config;
    const { payload } = await _signInWithPopup(
      domain,
      client_id,
      "firebase_auth",
      config?.screen_hint,
    );
    const user = await this._signInWithFirebasePayload(firebase_auth, payload);
    return { user };
  }
}
