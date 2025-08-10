export const Navigate = Symbol("Navigate");
export interface Navigate {
  (
    path: string,
    options?: {
      state?: unknown;
      replace?: boolean;
    }
  ): void | Promise<void>;
}
