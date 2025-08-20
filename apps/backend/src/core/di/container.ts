export type Factory<T> = () => T;
export type AsyncFactory<T> = () => Promise<T>;

export class Container {
  private singletons = new Map<string, any>();
  private factories = new Map<string, Factory<any> | AsyncFactory<any>>();

  register<T>(key: string, factory: Factory<T> | AsyncFactory<T>) {
    this.factories.set(key, factory);
  }

  singleton<T>(key: string, factory: Factory<T> | AsyncFactory<T>) {
    this.register(key, () => {
      if (!this.singletons.has(key)) {
        const instance = factory();
        this.singletons.set(key, instance);
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

    const result = factory();
    return result instanceof Promise ? await result : result;
  }

  resolveSync<T>(key: string): T {
    const factory = this.factories.get(key);
    if (!factory) {
      throw new Error(`No factory registered for key: ${key}`);
    }

    const result = factory();
    if (result instanceof Promise) {
      throw new Error(`Cannot resolve async factory synchronously: ${key}`);
    }
    return result;
  }
}
