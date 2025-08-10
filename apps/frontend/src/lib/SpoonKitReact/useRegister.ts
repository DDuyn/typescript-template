import { useEffect, useState } from "react";
import { register, unregister } from "../SpoonKit/providers";
import type { Class } from "../SpoonKit/types/Class";

export function useRegister<T>(token: Symbol | Class<any>, dependency: T) {
  const [dep] = useState(() => register(token, dependency));

  useEffect(() => {
    // this is necessary to avoid error when dev server performs the hot refresh
    register(token, dependency);

    return () => {
      unregister(dep);
    };
  }, []);
}
