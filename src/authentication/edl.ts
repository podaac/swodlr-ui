import base64 from '@hexagon/base64';
import arrayBufferToHex from 'array-buffer-to-hex';
import { OAuthParametersNotFound, OAuthTokenExchangeFailed, RequiredModulesNotFound } from './exception';
import { Session } from './session';

const BASE_REDIRECT_URI = process.env.REACT_APP_BASE_REDIRECT_URI;
const EDL_BASE_URI = process.env.REACT_APP_EDL_BASE_URI;
const EDL_CLIENT_ID = process.env.REACT_APP_EDL_CLIENT_ID;
const OAUTH_PARAMS_KEY = 'edl-auth-params';

const textEncoder = new TextEncoder();

declare interface OauthParameters {
  codeVerifier: string,
  codeChallenge: string,
  redirectUri: string,
  authorizeUri: string
}

declare interface PKCEParameters {
  codeVerifier: string,
  codeChallenge: string
}

function saveOauthParams(parameters: OauthParameters) {
  localStorage.setItem(OAUTH_PARAMS_KEY, JSON.stringify(parameters));
}

function loadOauthParameters(): OauthParameters | null {
  const paramJson = localStorage.getItem(OAUTH_PARAMS_KEY);
  if (!paramJson) {
    return null;
  }

  return JSON.parse(paramJson);
}

async function generatePKCEParameters(): Promise<PKCEParameters> {
  if (!crypto || !crypto.subtle) {
    throw new RequiredModulesNotFound(['crypto']);
  }

  // 512-bits of security! woo!
  const codeVerifier = base64.fromArrayBuffer(crypto.getRandomValues(new Uint8Array(64)), true);
  const codeChallenge = arrayBufferToHex(
    await crypto.subtle.digest('SHA-256', textEncoder.encode(codeVerifier)
  ));

  return { codeVerifier, codeChallenge };
}

function clearOauthParams() {
  localStorage.removeItem(OAUTH_PARAMS_KEY);
}

export async function generateEdlAuthorizeLink(): Promise<string> {
  // If an authorize link was already generated, return it
  const oauthParams = loadOauthParameters();
  if (oauthParams !== null) {
    return oauthParams.authorizeUri;
  }

  const redirectUri = new URL('#edl/code', BASE_REDIRECT_URI).toString();

  // Generate code challenge and verifier
  const { codeVerifier, codeChallenge } = await generatePKCEParameters();
  const authorizationParams = new URLSearchParams(Object.entries({
    response_type: 'code',
    redirect_uri: redirectUri,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    client_id: EDL_CLIENT_ID ?? ''
  }));

  const authorizeUri = new URL(`oauth/authorize?${authorizationParams.toString()}`, EDL_BASE_URI).toString();
  const oauthParameters: OauthParameters = { codeVerifier, codeChallenge, redirectUri, authorizeUri };

  saveOauthParams(oauthParameters);
  return authorizeUri.toString();
}

export async function exchangeAuthenticationCode(code: string): Promise<Session> {
  const oauthParameters = loadOauthParameters();
  if (!oauthParameters) {
    throw new OAuthParametersNotFound();
  }

  const tokenRequestParams = new URLSearchParams(Object.entries({
    grant_type: 'authorization_code',
    code_verifier: oauthParameters.codeVerifier,
    redirect_uri: oauthParameters.redirectUri,
    code
  }));

  const tokenUrl = new URL(
    `oauth/token?${tokenRequestParams.toString()}`,
    EDL_BASE_URI
  );

  // We don't catch network errors here; expect to handle higher level
  const response = await fetch(tokenUrl, {
    method: 'POST',
    credentials: 'include'
  });

  if (!response.ok)
    throw new OAuthTokenExchangeFailed(await response.json());

  clearOauthParams();
  return Session.fromOAuthTokenResponse(await response.json());
}

