import { users } from "@features/auth/infra/schemas/supabase-auth.schema";
import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const logs = pgTable("logs", {
  id: uuid("id").primaryKey(),
  level: varchar("level", { length: 10 }).notNull(),
  message: text("message").notNull(),
  metadata: jsonb("metadata"),
  userId: uuid("user_id").references(() => users.id),
  endpoint: varchar("endpoint", { length: 255 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const metrics = pgTable("metrics", {
  id: uuid("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  type: varchar("type", { length: 20 }).notNull(),
  value: integer("value").notNull(),
  metadata: jsonb("metadata"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const events = pgTable("events", {
  id: uuid("id").primaryKey(),
  type: varchar("type", { length: 50 }).notNull(),
  action: varchar("action", { length: 100 }).notNull(),
  userId: uuid("user_id").references(() => users.id),
  sessionId: varchar("session_id", { length: 100 }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const healthChecks = pgTable("health_checks", {
  id: uuid("id").primaryKey().defaultRandom(),
  service: varchar("service", { length: 50 }).notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  responseTime: integer("response_time"),
  message: text("message"),
  metadata: jsonb("metadata"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type LogRow = typeof logs.$inferSelect;
export type NewLogRow = typeof logs.$inferInsert;

export type MetricRow = typeof metrics.$inferSelect;
export type NewMetricRow = typeof metrics.$inferInsert;

export type EventRow = typeof events.$inferSelect;
export type NewEventRow = typeof events.$inferInsert;

export type HealthCheckRow = typeof healthChecks.$inferSelect;
export type NewHealthCheckRow = typeof healthChecks.$inferInsert;
