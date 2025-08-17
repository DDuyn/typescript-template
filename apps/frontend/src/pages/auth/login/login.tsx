import { Input } from "@component/AppFormControl/AppInput/input";
import { useCtrl } from "@lib/SpoonKitReactComposition/useCtrl";
import { createLoginCtrl } from "./loginCtrl";

export function Login() {
  const { self } = useCtrl(createLoginCtrl);

  return (
    <>
      <div> Hola</div>
      <Input ctrl={self.emailInput} />
    </>
  );
}
