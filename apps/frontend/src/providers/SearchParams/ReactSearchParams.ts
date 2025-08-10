import type { SetURLSearchParams } from "react-router-dom";
import type { SearchParams } from "./SearchParams";

export function createReactSearchParams(
  searchParams: URLSearchParams,
  setSearchParams: SetURLSearchParams
): SearchParams {
  return {
    get(key: string): string | null {
      return searchParams.get(key);
    },
    set(key: string, value: string) {
      setSearchParams({ [key]: value });
    },
    delete(key: string) {
      searchParams.delete(key);
    },
  };
}
