import { $untracked } from "../signals/$untracked";
import { calc, Calc } from "../signals/Calc";
import { monitor } from "../signals/Monitor";
import { state } from "../signals/State";
import type { ModelValues } from "../types/ModelTypes";
import { Entity } from "./Entity";

export abstract class EntityList<T extends Entity<any>> {
  public isFetching = state(false);

  private conf: { fetch: () => Promise<any> };
  private entities = state<T[]>([]);
  private items = calc(() => {
    const items = this.entities.get() ?? [];

    for (const item of items) {
      if (item.isErased.get()) {
        items.splice(items.indexOf(item), 1);
      }
    }

    return [...items];
  });

  constructor(conf: { fetch: () => Promise<any> }) {
    this.conf = conf;
    monitor(() => this.fetch());
  }

  public abstract resolveEntity(values: ModelValues<T["model"]>): T;

  public map<R>(mapFn?: (item: T) => R): Calc<R[]> {
    const cache = new Map<string, R>();

    return calc(() => {
      const items = this.items.get();

      return $untracked(() => {
        if (!mapFn) return items;

        const mappedItems: R[] = [];
        for (const item of items) {
          const cached = cache.get(item._key);
          if (cached !== undefined) {
            mappedItems.push(cached);
          } else {
            const mappedItem = mapFn(item);
            mappedItems.push(mappedItem);
            cache.set(item._key, mappedItem);
          }
        }

        return mappedItems;
      });
    }) as Calc<R[]>;
  }

  public async fetch() {
    this.isFetching.set(true);

    const data = await this.conf.fetch();
    const entities = data.map((item: any) => this.resolveEntity(item));
    //entities.forEach((entity) => entity.isPersisted.set(true));

    this.entities.set(entities);
    this.isFetching.set(false);

    return this.items;
  }

  public get() {
    return this.items.get();
  }

  public push() {
    const entity = this.resolveEntity({});

    this.entities.set([...(this.entities.get() ?? []), entity]);
    return entity;
  }
}
