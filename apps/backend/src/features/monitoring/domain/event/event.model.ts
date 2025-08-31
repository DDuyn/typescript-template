export type EventEntry = {
  type: string;
  action: string;
  userId?: string | null;
  sessionId?: string | null;
  metadata?: Record<string, any> | null;
};
