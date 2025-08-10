import type { ComponentType } from "react";
import { Ctrl } from "../SpoonKit/controller/Ctrl";
import { provide } from "../SpoonKit/providers";

export function ResolveCtrl({ ctrl }: { ctrl: Ctrl }) {
  const Component = provide(ctrl?.constructor as any) as ComponentType<any>;
  return <Component ctrl={ctrl} />;
}
