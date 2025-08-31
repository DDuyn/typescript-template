import { isErr, isOk } from "@core/result/result";
import { AuthRepository } from "@features/auth/infra/repositories/auth.repository";
import { LoggerService } from "@features/monitoring/domain/logger/logger.service";
import { MetricService } from "@features/monitoring/domain/metric/metric.service";
import { describe, expect, it, vi } from "vitest";
import { AuthContext } from "../auth.context";
import { loginService } from "./login.service";

const mockLogger: Partial<LoggerService> = {
  info: vi.fn(),
  debug: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  logAuth: vi.fn(),
};

const mockMetrics: Partial<MetricService> = {
  increment: vi.fn(),
  gauge: vi.fn(),
  histogram: vi.fn(),
  metricAuth: vi.fn(),
};

describe("loginService", () => {
  it("happy path: valid credentials, user is admin", async () => {
    const mockRepo: Partial<AuthRepository> = {
      signInWithEmail: vi.fn().mockResolvedValue({
        data: {
          session: {
            access_token: "token",
            refresh_token: "refresh",
            expires_in: 3600,
          },
          user: { id: "user1", email: "admin@test.com" },
        },
        error: null,
      }),
      findIsAdmin: vi.fn().mockResolvedValue(true),
    };
    const ctx: AuthContext = {
      repository: mockRepo as AuthRepository,
      logger: mockLogger as LoggerService,
      metrics: mockMetrics as MetricService,
    };

    const result = await loginService("admin@test.com", "password123", ctx);

    expect(isOk(result)).toBe(true);
    if (isOk(result)) {
      expect(result.value.userId).toBe("user1");
      expect(result.value.isAdmin).toBe(true);
    }
  });

  it("invalid credentials: should return Result.err", async () => {
    const mockRepo: Partial<AuthRepository> = {
      signInWithEmail: vi
        .fn()
        .mockResolvedValue({ data: { user: null, session: null }, error: {} }),
    };
    const ctx: AuthContext = {
      repository: mockRepo as AuthRepository,
      logger: mockLogger as LoggerService,
      metrics: mockMetrics as MetricService,
    };

    const result = await loginService("bad@test.com", "wrong", ctx);

    expect(isErr(result)).toBe(true);
  });

  it("user is not admin: should return isAdmin = false", async () => {
    const mockRepo: Partial<AuthRepository> = {
      signInWithEmail: vi.fn().mockResolvedValue({
        data: {
          session: {
            access_token: "token",
            refresh_token: "refresh",
            expires_in: 3600,
          },
          user: { id: "user2", email: "user@test.com" },
        },
        error: null,
      }),
      findIsAdmin: vi.fn().mockResolvedValue(false),
    };
    const ctx: AuthContext = {
      repository: mockRepo as AuthRepository,
      logger: mockLogger as LoggerService,
      metrics: mockMetrics as MetricService,
    };
    const result = await loginService("user@test.com", "password123", ctx);

    expect(isOk(result)).toBe(true);
    if (isOk(result)) {
      expect(result.value.isAdmin).toBe(false);
    }
  });

  it("repository throws error: should return Result.err", async () => {
    const mockRepo: Partial<AuthRepository> = {
      signInWithEmail: vi.fn().mockRejectedValue(new Error("DB failure")),
    };
    const ctx: AuthContext = {
      repository: mockRepo as AuthRepository,
      logger: mockLogger as LoggerService,
      metrics: mockMetrics as MetricService,
    };
    const result = await loginService("any@test.com", "password123", ctx);

    expect(isErr(result)).toBe(true);
  });

  it("repository throws non-Error: should return 'Unknown error'", async () => {
    const mockRepo: Partial<AuthRepository> = {
      signInWithEmail: vi.fn().mockRejectedValue("some string error"),
    };
    const ctx: AuthContext = {
      repository: mockRepo as AuthRepository,
      logger: mockLogger as LoggerService,
      metrics: mockMetrics as MetricService,
    };
    const result = await loginService("any@test.com", "password123", ctx);

    expect(isErr(result)).toBe(true);
    if (isErr(result)) expect(result.error).toBe("Unknown error");
  });
});
