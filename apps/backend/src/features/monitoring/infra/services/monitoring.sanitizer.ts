export class MonitoringSanitizer {
  private static readonly SENSITIVE_FIELDS = [
    "password",
    "token",
    "secret",
    "key",
    "auth",
    "email",
    "phone",
    "address",
    "name",
    "firstName",
    "lastName",
  ];

  private static readonly EMAIL_REGEX =
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  private static readonly PHONE_REGEX =
    /(\+?\d{1,4}[\s-]?)?\(?\d{1,4}\)?[\s-]?\d{1,4}[\s-]?\d{1,9}/g;

  static sanitizeMetadata(
    data: any,
    level: "strict" | "normal" | "minimal" = "normal"
  ): any {
    if (!data || typeof data !== "object") return data;

    const sanitized = Array.isArray(data) ? [...data] : { ...data };

    for (const [key, value] of Object.entries(sanitized)) {
      if (typeof value === "object" && value !== null) {
        sanitized[key] = this.sanitizeMetadata(value, level);
      } else if (typeof value === "string") {
        sanitized[key] = this.sanitizeString(key, value, level);
      }
    }

    return sanitized;
  }

  private static sanitizeString(
    key: string,
    value: string,
    level: "strict" | "normal" | "minimal"
  ): string {
    const lowerKey = key.toLowerCase();

    if (this.isCriticalField(lowerKey)) {
      return "[REDACTED]";
    }

    // Según el nivel
    switch (level) {
      case "strict":
        return this.strictSanitize(lowerKey, value);
      case "normal":
        return this.normalSanitize(lowerKey, value);
      case "minimal":
        return this.minimalSanitize(value);
      default:
        return value;
    }
  }

  private static isCriticalField(key: string): boolean {
    return ["password", "token", "secret", "key"].some((field) =>
      key.includes(field)
    );
  }

  private static strictSanitize(key: string, value: string): string {
    if (this.SENSITIVE_FIELDS.some((field) => key.includes(field))) {
      return this.maskValue(value);
    }

    return value.replace(this.EMAIL_REGEX, "[EMAIL]");
  }

  private static normalSanitize(key: string, value: string): string {
    if (key.includes("email")) {
      return this.maskEmail(value);
    }

    return value;
  }

  private static minimalSanitize(value: string): string {
    if (value.length > 100 && !value.includes(" ")) {
      return "[LONG_TOKEN]";
    }
    return value;
  }

  private static maskEmail(email: string): string {
    const [local, domain] = email.split("@");
    if (!domain) return "[INVALID_EMAIL]";

    const maskedLocal =
      local.length > 2 ? `${local[0]}***${local[local.length - 1]}` : "***";

    return `${maskedLocal}@${domain}`;
  }

  private static maskValue(value: string): string {
    if (value.length <= 4) return "***";
    return `${value.substring(0, 2)}***${value.substring(value.length - 2)}`;
  }

  static getLogLevel(): "strict" | "normal" | "minimal" {
    if (process.env.NODE_ENV === "production") return "strict";
    return "minimal";
  }
}
