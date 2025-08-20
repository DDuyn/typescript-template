import { AnyFactory, Container } from "./container";

export class CompositionBuilder {
  private container = new Container();

  registerSingleton<T>(key: string, factory: AnyFactory<T>) {
    this.container.singleton(key, factory);
    return this;
  }

  registerTransient<T>(key: string, factory: AnyFactory<T>) {
    this.container.register(key, factory);
    return this;
  }

  registerInstance<T>(key: string, instance: T) {
    this.container.instance(key, instance);
    return this;
  }

  registerSingletonWithDeps<T>(
    key: string,
    dependencies: string[],
    factory: (...deps: any[]) => T
  ) {
    this.container.singleton(key, (container: Container) => {
      const resolvedDeps = dependencies.map((dep) =>
        container.resolveSync(dep)
      );
      return factory(...resolvedDeps);
    });
    return this;
  }

  registerAsyncSingletonWithDeps<T>(
    key: string,
    dependencies: string[],
    factory: (...deps: any[]) => Promise<T>
  ) {
    this.container.singleton(key, async (container: Container) => {
      const resolvedDeps = await Promise.all(
        dependencies.map((dep) => container.resolve(dep))
      );
      return factory(...resolvedDeps);
    });
    return this;
  }

  build(): Container {
    return this.container;
  }
}
