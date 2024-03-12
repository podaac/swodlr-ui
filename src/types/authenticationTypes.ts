import { CurrentUser } from "./graphqlTypes"

export interface AuthenticationResponse {
  status: 'authenticated' | 'unauthenticated' | 'unknown' | 'error',
  redirectUrl?: string,
  errorMessage?: string
}

export interface TestAuthenticationResponse {
  authenticated: boolean,
  redirectUri?: string,
  error?: string,
  data?: CurrentUser
}