export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogEntry = {
  level: LogLevel;
  message: string;
  metadata?: Record<string, any> | null;
  userId?: string | null;
  endpoint?: string | null;
  userAgent?: string | null;
  ip?: string | null;
};

export type HealthCheckEntry = {
  service: string;
  status: "healthy" | "unhealthy";
  responseTime?: number | null;
  message?: string | null;
  metadata?: Record<string, any> | null;
};
