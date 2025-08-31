import { MonitoringSanitizer } from "@features/monitoring/infra/services/monitoring.sanitizer";
import { MonitoringContext } from "../monitoring.context";
import { EventEntry } from "./event.model";

export class EventService {
  constructor(private context: MonitoringContext) {}

  async track(
    type: string,
    action: string,
    userId?: string,
    sessionId?: string,
    metadata?: any
  ) {
    try {
      const sanitizedMetadata = metadata
        ? MonitoringSanitizer.sanitizeMetadata(
            metadata,
            MonitoringSanitizer.getLogLevel()
          )
        : null;

      const eventData: EventEntry = {
        type,
        action,
        userId,
        sessionId,
        metadata: sanitizedMetadata,
      };

      this.context.repository.createEvent(eventData).catch((err) => {
        console.error(`Failed to save event: ${err}`);
      });
      return true;
    } catch (error) {
      console.error(`Failed to save event: ${error}`);
      return false;
    }
  }
}
