import { MonitoringSanitizer } from "@features/monitoring/infra/services/monitoring.sanitizer";
import { MonitoringContext } from "../monitoring.context";
import { MetricEntry } from "./metric.model";

export class MetricService {
  constructor(private context: MonitoringContext) {}

  async increment(name: string, value: number = 1, metadata?: any) {
    return this.metric(name, value, "counter", metadata);
  }

  async gauge(name: string, value: number, metadata?: any) {
    return this.metric(name, value, "gauge", metadata);
  }

  async histogram(name: string, value: number, metadata?: any) {
    return this.metric(name, value, "histogram", metadata);
  }

  async metricRequest(
    method: string,
    path: string,
    statusCode: number,
    responseTime: number
  ) {
    await this.metric("http.requests", 1, "counter", {
      method,
      path,
      statusCode,
    });
    await this.metric("htpp.response_time", responseTime, "histogram", {
      method,
      path,
    });
  }

  async metricAuth(
    type: "login" | "logout" | "signup" | "failed_login",
    email?: string
  ) {
    await this.metric(`auth.${type}`, 1, "counter", { email });
  }

  private async metric(
    name: string,
    value: number,
    type: "counter" | "gauge" | "histogram",
    metadata?: any
  ) {
    try {
      const sanitizedMetadata = metadata
        ? MonitoringSanitizer.sanitizeMetadata(
            metadata,
            MonitoringSanitizer.getLogLevel()
          )
        : null;

      const metricData: MetricEntry = {
        name,
        value,
        type,
        metadata: sanitizedMetadata,
      };

      this.context.repository.createMetric(metricData).catch((err) => {
        console.error(`Failed to save metric: ${err}`);
      });

      return true;
    } catch (error) {
      console.error(`Failed to save metric: ${error}`);
      return false;
    }
  }
}
