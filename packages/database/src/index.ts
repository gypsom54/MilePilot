/**
 * @seo-autopilot/database
 *
 * Sprint 0: interface placeholder only.
 * No schemas, migrations, or SEO/business persistence logic.
 * Database Bible will define the real contract.
 */

export interface DatabaseClient {
  /** Connectivity check — no domain operations in Sprint 0 */
  ping(): Promise<{ ok: boolean }>;
}

export const DATABASE_PACKAGE_STATUS = "scaffold-only" as const;
