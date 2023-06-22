export interface AuthenticationResponse {
  status: 'authenticated' | 'unauthenticated' | 'unknown',
  redirectUrl?: string
}