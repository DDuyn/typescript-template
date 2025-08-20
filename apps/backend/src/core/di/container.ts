export type Factory<T> = () => T;
export type AsyncFactory<T> = () => Promise<T>;
export type DependentFactory<T> = (container: Container) => T;
export type AsyncDependentFactory<T> = (container: Container) => Promise<T>;

export type AnyFactory<T> =
  | Factory<T>
  | AsyncFactory<T>
  | DependentFactory<T>
  | AsyncDependentFactory<T>;

export class Container {
  private singletons = new Map<string, any>();
  private factories = new Map<string, AnyFactory<any>>();
  private isBuilding = new Set<string>();

  register<T>(key: string, factory: AnyFactory<T>) {
    this.factories.set(key, factory);
  }

  singleton<T>(key: string, factory: AnyFactory<T>) {
    this.register(key, (container?: Container) => {
      if (!this.singletons.has(key)) {
        if (this.isBuilding.has(key)) {
          throw new Error(`Circular dependency detected: ${key}`);
        }

        this.isBuilding.add(key);

        try {
          let instance: T | Promise<T>;

          if (factory.length > 0) {
            instance = (
              factory as DependentFactory<T> | AsyncDependentFactory<T>
            )(this);
          } else {
            instance = (factory as Factory<T> | AsyncFactory<T>)();
          }

          this.singletons.set(key, instance);
        } finally {
          this.isBuilding.delete(key);
        }
      }
      return this.singletons.get(key);
    });
  }

  instance<T>(key: string, instance: T): void {
    this.singletons.set(key, instance);
  }

  async resolve<T>(key: string): Promise<T> {
    const factory = this.factories.get(key);
    if (!factory) {
      throw new Error(`No factory registered for key: ${key}`);
    }

    let result: T | Promise<T>;

    if (factory.length > 0) {
      result = (factory as DependentFactory<T> | AsyncDependentFactory<T>)(
        this
      );
    } else {
      result = (factory as Factory<T> | AsyncFactory<T>)();
    }

    return result instanceof Promise ? await result : result;
  }

  resolveSync<T>(key: string): T {
    const factory = this.factories.get(key);
    if (!factory) {
      throw new Error(`No factory registered for key: ${key}`);
    }

    let result: T;

    if (factory.length > 0) {
      result = (factory as DependentFactory<T>)(this);
    } else {
      result = (factory as Factory<T>)();
    }

    if (result instanceof Promise) {
      throw new Error(`Cannot resolve async factory synchronously: ${key}`);
    }

    return result;
  }

  has(key: string): boolean {
    return this.factories.has(key);
  }

  getKeys(): string[] {
    return Array.from(this.factories.keys());
  }
}
