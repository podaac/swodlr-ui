import { OAuthTokenExchangeFailed } from "./exception";

declare interface OauthTokenResponse {
  access_token: string,
  token_type: string,
  expires_in: number,
  refresh_token: string,
  endpoint: string
}

declare interface SerializedSession {
  accessToken: string,
  refreshToken: string,
  expires: number,
}

const LOCAL_STORAGE_SESSION_KEY = 'session';
const EDL_BASE_URI = import.meta.env.VITE_EDL_BASE_URI;
const EDL_CLIENT_ID = import.meta.env.VITE_EDL_CLIENT_ID;

export class Session {
  private static _current: Session | null = null;

  private _accessToken: string;
  private _refreshToken: string;
  private _expires: number;

  constructor(accessToken: string, refreshToken: string, expires: number) {
    if (Session._current !== null) {
      throw new Error('Multiple sessions cannot be created');
    }

    this._accessToken = accessToken;
    this._refreshToken = refreshToken;
    this._expires = expires;
  }

  private static async fromLocalStorage(): Promise<Session | null> {
    var value = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
    if (value === null) {
      return null;
    }

    const rawSession: SerializedSession = JSON.parse(value);
    const session = new Session(
      rawSession.accessToken,
      rawSession.refreshToken,
      rawSession.expires
    );

    if (await session.isExpired()) {
      return null;
    }

    return session;
  }

  private async refreshAccessToken() {
    const tokenRequestParams = new URLSearchParams(Object.entries({
      grant_type: 'refresh_token',
      refresh_token: this._refreshToken
    }));

    const tokenUrl = new URL(
      `oauth/token?${tokenRequestParams.toString()}`,
      EDL_BASE_URI
    );

    const response = await fetch(tokenUrl);
    const body = await response.json();
    if (!response.ok) {
      throw new OAuthTokenExchangeFailed(body);
    }

    const { access_token, refresh_token, expires_in } = body;
    this._accessToken = access_token;
    this._refreshToken = refresh_token;
    this._expires = Date.now() + (expires_in * 1000);
  }

  private accessTokenExpired(): boolean {
    return Date.now() >= this._expires;
  }

  private saveToLocalStorage() {
    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(this.toJSON()));
  }

  static async getCurrent(): Promise<Session | null> {
    if (!Session._current) {
      Session._current = await Session.fromLocalStorage();
    }

    return this._current;
  }

  async getAccessToken() {
    if (!this.accessTokenExpired()) {
      return this._accessToken;
    }

    await this.refreshAccessToken();
    return this._accessToken;
  }

  toJSON(): SerializedSession {
    const value: SerializedSession = {
      accessToken: this._accessToken,
      refreshToken: this._refreshToken,
      expires: this._expires
    }

    return value;
  }

  async isExpired() {
    if (this.accessTokenExpired()) {
      // Attempt token refresh
      try {
        await this.refreshAccessToken();
      } catch (ex) {
        if (ex instanceof OAuthTokenExchangeFailed) {
          return true; // Treat the failure to refresh as an expired refresh
        } else {
          throw ex; // Bubble the exception up
        }
      }
    }

    return this.accessTokenExpired();
  }

  static invalidateCurrentSession() {
    localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
    Session._current = null;
  }

  static fromOAuthTokenResponse(response: OauthTokenResponse): Session {
    const session = new Session(
      response.access_token,
      response.refresh_token,
      Date.now() + (response.expires_in * 1000)
    );

    session.saveToLocalStorage();
    return session;
  }
}
