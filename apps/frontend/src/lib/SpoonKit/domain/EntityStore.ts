import { monitor } from "../signals/Monitor";
import type { ModelValues } from "../types/ModelTypes";
import { Entity } from "./Entity";

export abstract class EntityStore<T extends Entity<any>> {
  private instances = new Map<number | string, T>();

  protected abstract buildEntity(): T;

  protected abstract generateKey(
    values: ModelValues<T["model"]>
  ): string | number;

  public get(key: number | string) {
    return this.instances.get(key);
  }

  public has(key: number | string) {
    return this.instances.has(key);
  }

  public resolve(values: ModelValues<T["model"]>) {
    const key = this.generateKey(values);
    let entity: T;

    if (key !== undefined && key !== null) {
      if (this.instances.has(key)) {
        entity = this.instances.get(key)!;
      } else {
        entity = this.buildEntity();
        this.instances.set(key, entity);
      }

      return entity.set(values, { mode: "remote" });
    } else {
      entity = this.buildEntity();

      monitor(() => {
        if (entity.isRemote.get()) {
          this.instances.set(this.generateKey(entity.get()), entity);
        }
      });

      return entity.set(values, { mode: "local" });
    }
  }
}
