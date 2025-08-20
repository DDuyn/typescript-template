import { Container, Factory } from "./container";

export class CompositionBuilder {
  private container = new Container();

  registerSingleton<T>(key: string, factory: Factory<T>) {
    this.container.singleton(key, factory);
    return this;
  }

  registerTransient<T>(key: string, factory: Factory<T>) {
    this.container.register(key, factory);
    return this;
  }

  registerInstance<T>(key: string, instance: T) {
    this.container.instance(key, instance);
    return this;
  }

  build(): Container {
    return this.container;
  }
}
