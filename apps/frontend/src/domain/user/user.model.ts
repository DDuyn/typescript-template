import { field } from "@lib/SpoonKit/domain/Field";
import { monitor } from "@lib/SpoonKit/signals/Monitor";
import { isEmail } from "@validation/isEmail";
import { isRequired } from "@validation/isRequired";
import { isStrongPassword } from "@validation/isStrongPassword";

export function createUserModel() {
  const model = {
    user: field<string>(),
    password: field<string>(),
    remember: field<boolean>(),
  };

  function validate() {
    model.user.validate(isRequired(), isEmail());
    model.password.validate(isRequired(), isStrongPassword());
  }

  monitor(validate);

  return {
    model,
  };
}
