export type MetricEntry = {
  name: string;
  value: number;
  type: "counter" | "gauge" | "histogram";
  metadata?: Record<string, any> | null;
};
