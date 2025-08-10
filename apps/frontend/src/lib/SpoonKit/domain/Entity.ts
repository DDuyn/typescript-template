import { calc } from "../signals/Calc";
import { state } from "../signals/State";
import type { ModelValues } from "../types/ModelTypes";
import type { FieldOptions } from "./Field";
import { FieldModel } from "./FieldModel";

type EntityStatus = "LOCAL" | "REMOTE" | "ERASED";

type EntityLifeCycle =
  | "READY"
  | "SYNCING"
  | "SYNC_ERROR"
  | "COMMITTING"
  | "COMMIT_ERROR"
  | "DROPPING"
  | "DROP_ERROR"
  | "DROPPED";

export abstract class Entity<T> extends FieldModel<T> {
  public _key = Math.random().toString(36).substring(2, 15);

  private status = state<EntityStatus>("LOCAL");
  private activeLifeCycle = state<EntityLifeCycle>("READY");

  private currentSyncReq: Promise<ModelValues<T>> | null = null;
  private currentCommitReq: Promise<void> | null = null;
  private currentDropReq: Promise<void> | null = null;

  public isLocal = calc(() => this.status.get() === "LOCAL");
  public isRemote = calc(() => this.status.get() === "REMOTE");
  public isErased = calc(() => this.status.get() === "ERASED");

  public lifeCycle = {
    ready: calc(() => this.activeLifeCycle.get() === "READY"),
    syncing: calc(() => this.activeLifeCycle.get() === "SYNCING"),
    syncError: calc(() => this.activeLifeCycle.get() === "SYNC_ERROR"),
    committing: calc(() => this.activeLifeCycle.get() === "COMMITTING"),
    commitError: calc(() => this.activeLifeCycle.get() === "COMMIT_ERROR"),
    dropping: calc(() => this.activeLifeCycle.get() === "DROPPING"),
    dropError: calc(() => this.activeLifeCycle.get() === "DROP_ERROR"),
    dropped: calc(() => this.activeLifeCycle.get() === "DROPPED"),
  };

  public set(values: ModelValues<T>, options?: FieldOptions) {
    super.set(values, options);
    this.status.set(options?.mode === "local" ? "LOCAL" : "REMOTE");
    return this;
  }

  protected commit(req: (values: ModelValues<T>) => Promise<ModelValues<T>>) {
    if (!this.isDirty.get()) return Promise.resolve(this.get());
    if (!this.isValid.get()) throw new Error("Entity is invalid");
    if (this.isErased.get()) throw new Error("Entity is erased");

    if (this.currentCommitReq) return this.currentCommitReq;

    this.activeLifeCycle.set("COMMITTING");

    return (this.currentCommitReq = req(this.get())
      .then((result) => {
        this.set(result, { mode: "commit" });
        this.status.set("REMOTE");
        this.activeLifeCycle.set("READY");
      })
      .catch((error) => {
        this.activeLifeCycle.set("COMMIT_ERROR");
        throw error;
      })
      .finally(() => {
        this.currentCommitReq = null;
      }));
  }

  protected drop(req: (values: ModelValues<T>) => Promise<void>) {
    if (this.isErased.get()) throw new Error("Entity is erased");
    if (this.currentDropReq) return this.currentDropReq;

    this.activeLifeCycle.set("DROPPING");

    return (this.currentDropReq = req(this.get())
      .then(() => {
        this.status.set("ERASED");
        this.activeLifeCycle.set("DROPPED");
      })
      .catch((error) => {
        this.activeLifeCycle.set("DROP_ERROR");
        throw error;
      })
      .finally(() => {
        this.currentDropReq = null;
      }));
  }

  protected sync(req: (values: ModelValues<T>) => Promise<ModelValues<T>>) {
    if (this.isErased.get()) throw new Error("Entity is erased");
    if (this.currentSyncReq) return this.currentSyncReq;

    this.activeLifeCycle.set("SYNCING");

    return (this.currentSyncReq = req(this.get())
      .then((result) => {
        this.set(result, { mode: "remote" });
        this.status.set("REMOTE");
        this.activeLifeCycle.set("READY");
        return result;
      })
      .catch((error) => {
        this.activeLifeCycle.set("SYNC_ERROR");
        throw error;
      })
      .finally(() => {
        this.currentSyncReq = null;
      }));
  }
}
