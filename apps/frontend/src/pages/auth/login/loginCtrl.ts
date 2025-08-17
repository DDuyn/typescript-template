import { createInputCtrl } from "@component/AppFormControl/AppInput/input.ctrl";
import { createUserEntity } from "@domain/user/user.entity";
import { calc } from "@lib/SpoonKit/signals/Calc";
import { state } from "@lib/SpoonKit/signals/State";

export function createLoginCtrl() {
  //const authService: AuthService = provide(AuthService);
  const loginError = state<string>();
  const userEntity = createUserEntity();
  console.log(self);

  const emailInput = createInputCtrl().set({
    label: "User",
    value: userEntity.model.user,
    size: "medium",
    isValid: userEntity.model.user.isValid,
    helperText: calc(() => userEntity.model.user.firstError()),
  });

  return {
    loginError,
    emailInput,
  };
}
