export interface AuthenticationResponse {
  status: 'authenticated' | 'unauthenticated' | 'unknown' | 'error',
  redirectUrl?: string,
  errorMessage?: string
}