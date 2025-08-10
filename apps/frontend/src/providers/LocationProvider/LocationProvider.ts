export const LocationProvider = Symbol("LocationProvider");
export type LocationProvider = () => {
  hash: string;
  key: string;
  pathname: string;
  search: string;
  state: any;
}
