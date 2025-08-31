import { EventEntry } from "@features/monitoring/domain/event/event.model";
import { LogEntry } from "@features/monitoring/domain/logger/logger.model";
import { MetricEntry } from "@features/monitoring/domain/metric/metric.model";
import { db } from "@infra/db/drizzle";
import {
  events,
  healthChecks,
  logs,
  metrics,
  NewEventRow,
  NewHealthCheckRow,
  NewLogRow,
  NewMetricRow,
} from "@infra/db/schema/monitoring.schema";
import { randomUUID } from "crypto";
import { and, desc, eq, gte, lte, sql } from "drizzle-orm";

export class MonitoringRepository {
  async createLog(logEntry: LogEntry) {
    const logData: NewLogRow = {
      id: randomUUID(),
      level: logEntry.level,
      message: logEntry.message,
      metadata: logEntry.metadata,
      userId: logEntry.userId,
      endpoint: logEntry.endpoint,
      userAgent: logEntry.userAgent,
    };
    const [created] = await db.insert(logs).values(logData).returning();
    return created;
  }

  async getLogs(
    filters: {
      level?: string;
      endpoint?: string;
      userId?: string;
      from?: Date;
      to?: Date;
      limit?: number;
      offset?: number;
    } = {}
  ) {
    const conditions = [];

    if (filters.level) conditions.push(eq(logs.level, filters.level));
    if (filters.endpoint) conditions.push(eq(logs.endpoint, filters.endpoint));
    if (filters.userId) conditions.push(eq(logs.userId, filters.userId));
    if (filters.from) conditions.push(gte(logs.createdAt, filters.from));
    if (filters.to) conditions.push(lte(logs.createdAt, filters.to));

    return db
      .select()
      .from(logs)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(logs.createdAt))
      .limit(filters.limit || 100)
      .offset(filters.offset || 0);
  }

  async createMetric(metricEntry: MetricEntry) {
    const metricData: NewMetricRow = {
      id: randomUUID(),
      name: metricEntry.name,
      value: metricEntry.value,
      type: metricEntry.type,
      metadata: metricEntry.metadata,
    };
    const [created] = await db.insert(metrics).values(metricData).returning();
    return created;
  }

  async getMetrics(
    filters: {
      name?: string;
      type?: string;
      from?: Date;
      to?: Date;
      limit?: number;
    } = {}
  ) {
    const conditions = [];

    if (filters.name) conditions.push(eq(metrics.name, filters.name));
    if (filters.type) conditions.push(eq(metrics.type, filters.type));
    if (filters.from) conditions.push(gte(metrics.timestamp, filters.from));
    if (filters.to) conditions.push(lte(metrics.timestamp, filters.to));

    return db
      .select()
      .from(metrics)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(metrics.timestamp))
      .limit(filters.limit || 100);
  }

  async getMetricsSummary(name: string, hours: number = 24) {
    const from = new Date(Date.now() - hours * 60 * 60 * 1000);

    return db
      .select({
        total: sql<number>`count(*)`,
        avg: sql<number>`avg(${metrics.value})`,
        min: sql<number>`min(${metrics.value})`,
        max: sql<number>`max(${metrics.value})`,
      })
      .from(metrics)
      .where(and(eq(metrics.name, name), gte(metrics.timestamp, from)));
  }

  async createEvent(eventEntry: EventEntry) {
    const eventData: NewEventRow = {
      id: randomUUID(),
      type: eventEntry.type,
      action: eventEntry.action,
      userId: eventEntry.userId,
      sessionId: eventEntry.sessionId,
      metadata: eventEntry.metadata,
    };
    const [created] = await db.insert(events).values(eventData).returning();
    return created;
  }

  async getEvents(
    filters: {
      type?: string;
      action?: string;
      userId?: string;
      from?: Date;
      to?: Date;
      limit?: number;
      offset?: number;
    } = {}
  ) {
    const conditions = [];
    if (filters.type) conditions.push(eq(events.type, filters.type));
    if (filters.action) conditions.push(eq(events.action, filters.action));
    if (filters.userId) conditions.push(eq(events.userId, filters.userId));
    if (filters.from) conditions.push(gte(events.createdAt, filters.from));
    if (filters.to) conditions.push(lte(events.createdAt, filters.to));

    return db
      .select()
      .from(events)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(events.createdAt))
      .limit(filters.limit || 100)
      .offset(filters.offset || 0);
  }

  async createHealthCheck(healthCheckData: NewHealthCheckRow) {
    const [created] = await db
      .insert(healthChecks)
      .values(healthCheckData)
      .returning();
    return created;
  }

  async getLatestHealthCheck() {
    return db
      .select()
      .from(healthChecks)
      .orderBy(desc(healthChecks.timestamp))
      .limit(20);
  }

  async getServiceHealthChecks(service: string, hours: number = 1) {
    const from = new Date(Date.now() - hours * 60 * 60 * 1000);

    return db
      .select()
      .from(healthChecks)
      .where(
        and(
          eq(healthChecks.service, service),
          gte(healthChecks.timestamp, from)
        )
      )
      .orderBy(desc(healthChecks.timestamp));
  }

  async getErrorRate(hours: number = 24) {
    const from = new Date(Date.now() - hours * 60 * 60 * 1000);

    const result = await db
      .select({
        level: logs.level,
        count: sql<number>`count(*)`,
      })
      .from(logs)
      .where(gte(logs.createdAt, from))
      .groupBy(logs.level);

    const total = result.reduce((acc, curr) => acc + curr.count, 0);
    const errors = result.find((r) => r.level === "error")?.count || 0;

    return {
      total,
      errors,
      errorRate: total > 0 ? (errors / total) * 100 : 0,
      breakdown: result,
    };
  }

  async getTopEndpoints(hours: number = 24, limit: number = 10) {
    const from = new Date(Date.now() - hours * 60 * 60 * 1000);

    return db
      .select({
        endpoint: logs.endpoint,
        count: sql<number>`count(*)`,
      })
      .from(logs)
      .where(and(gte(logs.createdAt, from), sql`${logs.endpoint} is not null`))
      .groupBy(logs.endpoint)
      .orderBy(desc(sql`count(*)`))
      .limit(limit);
  }
}
