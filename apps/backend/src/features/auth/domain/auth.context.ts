import { LoggerService } from "@features/monitoring/domain/logger/logger.service";
import { AuthRepository } from "../infra/repositories/auth.repository";
import { MetricService } from "@features/monitoring/domain/metric/metric.service";

export type AuthContext = {
  repository: AuthRepository;
  logger: LoggerService;
  metrics: MetricService;
};
