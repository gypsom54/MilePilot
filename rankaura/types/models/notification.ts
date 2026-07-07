export type NotificationType = "info" | "success" | "approval" | "alert";

export interface Notification {
  id: string;
  businessId: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl: string | null;
  createdAt: string;
}
