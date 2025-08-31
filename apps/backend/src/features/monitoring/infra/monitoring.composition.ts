// monitoring.composition.ts
import { EventService } from "../domain/event/event.service";
import { LoggerService } from "../domain/logger/logger.service";
import { MetricService } from "../domain/metric/metric.service";
import { MonitoringContext } from "../domain/monitoring.context";
import { MonitoringRepository } from "./repositories/monitoring.repository";

export type MonitoringDependencies = {
  repository: MonitoringRepository;
  logger: LoggerService;
  metrics: MetricService;
  events: EventService;
};

export function createMonitoringDependencies() {
  const monitoringRepository = new MonitoringRepository();
  const logger = new LoggerService({ repository: monitoringRepository });
  const metrics = new MetricService({ repository: monitoringRepository });
  const events = new EventService({ repository: monitoringRepository });

  return {
    monitoringRepository,
    logger,
    metrics,
    events,
  };
}

export function createMonitoringContext(): MonitoringContext {
  const { monitoringRepository } = createMonitoringDependencies();
  return { repository: monitoringRepository };
}

let globalLogger: LoggerService | null = null;
let globalMetrics: MetricService | null = null;
let globalEvents: EventService | null = null;

export function getLogger(): LoggerService {
  if (!globalLogger) {
    const { logger } = createMonitoringDependencies();
    globalLogger = logger;
  }
  return globalLogger;
}

export function getMetrics(): MetricService {
  if (!globalMetrics) {
    const { metrics } = createMonitoringDependencies();
    globalMetrics = metrics;
  }
  return globalMetrics;
}

export function getEvents(): EventService {
  if (!globalEvents) {
    const { events } = createMonitoringDependencies();
    globalEvents = events;
  }
  return globalEvents;
}
