export const SearchParams = Symbol("SearchParams");
export interface SearchParams {
  get(key: string): string | null;
  set(key: string, value: string): void;
  delete(key: string): void;
}
