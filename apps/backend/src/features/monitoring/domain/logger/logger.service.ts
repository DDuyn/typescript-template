import { MonitoringSanitizer } from "@features/monitoring/infra/services/monitoring.sanitizer";
import { MonitoringContext } from "../monitoring.context";
import { LogEntry, LogLevel } from "./logger.model";

export class LoggerService {
  constructor(private context: MonitoringContext) {}

  async info(
    message: string,
    metadata?: any,
    userId?: string,
    endpoint?: string
  ) {
    return this.log("info", message, metadata, userId, endpoint);
  }

  async debug(
    message: string,
    metadata?: any,
    userId?: string,
    endpoint?: string
  ) {
    return this.log("debug", message, metadata, userId, endpoint);
  }

  async warn(
    message: string,
    metadata?: any,
    userId?: string,
    endpoint?: string
  ) {
    return this.log("warn", message, metadata, userId, endpoint);
  }

  async error(
    message: string,
    metadata?: any,
    userId?: string,
    endpoint?: string
  ) {
    return this.log("error", message, metadata, userId, endpoint);
  }

  async logRequest(
    method: string,
    path: string,
    statusCode: number,
    responseTime: number,
    userId?: string,
    userAgent?: string
  ) {
    const level: LogLevel =
      statusCode >= 500 ? "error" : statusCode >= 400 ? "warn" : "info";
    const message = `${method} ${path} - ${statusCode} (${responseTime}ms)`;

    const metadata = {
      method,
      path,
      statusCode,
      responseTime,
      userId,
      userAgent,
    };

    await this.log(level, message, metadata, userId, path);
  }

  async logAuth(
    type: "login" | "logout" | "signup" | "failed_login",
    userId?: string,
    email?: string
  ) {
    const message = `Auth: ${type}${email ? ` for ${email}` : ""}`;
    const level: LogLevel = type === "failed_login" ? "warn" : "info";
    await this.log(level, message, { type, userId, email }, userId);
  }

  private async log(
    level: LogLevel,
    message: string,
    metadata?: any,
    userId?: string,
    endpoint?: string
  ) {
    try {
      const sanitizedMetadata = metadata
        ? MonitoringSanitizer.sanitizeMetadata(
            metadata,
            MonitoringSanitizer.getLogLevel()
          )
        : null;

      const logData: LogEntry = {
        level,
        message,
        metadata: sanitizedMetadata,
        userId: userId || null,
        endpoint: endpoint || null,
        userAgent: null,
        ip: null,
      };

      const logMethod =
        level === "error"
          ? console.error
          : level === "warn"
          ? console.warn
          : console.log;

      logMethod(`[${level.toUpperCase()}] ${message}`, metadata || "");

      this.context.repository.createLog(logData).catch((err) => {
        console.error(`Failed to save log: ${err}`);
      });

      return true;
    } catch (error) {
      console.error(`Failed to log message: ${error}`);
      return false;
    }
  }
}
