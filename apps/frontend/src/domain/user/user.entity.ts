import { createUserModel } from "./user.model";

export function createUserEntity() {
  const { model } = createUserModel();

  return {
    model,
  };
}
