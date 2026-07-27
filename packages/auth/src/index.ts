/**
 * @seo-autopilot/auth
 *
 * Sprint 0: interface placeholder only.
 * No authentication UI. No login flows. No session business logic.
 */

export interface AuthPrincipal {
  id: string;
  roles: string[];
}

export interface AuthService {
  /** Identity resolution placeholder — unimplemented until Auth Bible */
  resolvePrincipal(token: string): Promise<AuthPrincipal | null>;
}

export const AUTH_PACKAGE_STATUS = "scaffold-only" as const;
