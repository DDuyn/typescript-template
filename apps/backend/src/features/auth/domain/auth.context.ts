import { LoggerService } from "@features/monitoring/domain/logger/logger.service";
import { MetricService } from "@features/monitoring/domain/metric/metric.service";
import { AuthRepository } from "../infra/repositories/auth.repository";

export type AuthContext = {
  repository: AuthRepository;
  logger: LoggerService;
  metrics: MetricService;
};
