import { useState } from "react";
import { provide } from "../SpoonKit/providers";
import type { Class } from "../SpoonKit/types/Class";

export function useProvider(token: Symbol | Class<any>) {
  const [instance] = useState(() => provide(token));

  return instance;
}
