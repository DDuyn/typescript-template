export function createSet<T extends Record<string, any>>(states: T) {
  return function set(props: Partial<T> & { [key: string]: any }) {
    for (const key in props) {
      if (states[key] && typeof states[key].set === "function") {
        states[key].set(props[key]);
      } else {
        (states as any)[key] = props[key];
      }
    }
  };
}
