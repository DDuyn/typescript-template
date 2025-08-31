// api/create-monitoring.request.ts
import { z } from "zod";

export const createMonitoringRequestSchema = z.object({
  // Add your validation schema here
  name: z.string().min(1),
});

export type CreateMonitoringRequest = z.infer<typeof createMonitoringRequestSchema>;
