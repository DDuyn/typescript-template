// domain/monitoring.context.ts
import { MonitoringRepository } from "../infra/repositories/monitoring.repository";

export type MonitoringContext = {
  repository: MonitoringRepository;
};
