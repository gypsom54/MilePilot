/**
 * User and business preference memory.
 */

export interface PreferenceMemory {
  autopilotEnabled: boolean;
  approvalRequiredForPublishing: boolean;
  preferredLanguage: string;
  timezone: string;
  notificationPreferences: string[];
  updatedAt: string;
}
