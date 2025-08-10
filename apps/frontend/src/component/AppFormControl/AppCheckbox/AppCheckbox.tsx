import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";
import { useCtrl } from "../../../lib/SpoonKitReact/useCtrl";
import { AppCheckboxCtrl } from "./AppCheckboxCtrl";

export function AppCheckbox({ ctrl }: { ctrl: AppCheckboxCtrl }) {
  const { state, setState } = useCtrl(ctrl);
  const showError = state.isTouched && !state.isValid;

  return (
    <FormControl
      fullWidth={state.fullWidth}
      error={showError}
      component="fieldset"
      className={showError && "bg-red-50 rounded-t-md"}
    >
      {!state.label && (
        <Checkbox
          checked={!!state.value}
          indeterminate={state.indeterminate}
          onChange={(_, checked) => setState({ value: checked })}
          onBlur={() => setState({ isTouched: true })}
          disabled={state.disabled}
        />
      )}
      {state.label && (
        <FormControlLabel
          className="px-2"
          control={
            <Checkbox
              checked={!!state.value}
              indeterminate={state.indeterminate}
              onChange={(_, checked) => setState({ value: checked })}
              onBlur={() => setState({ isTouched: true })}
              disabled={state.disabled}
            />
          }
          label={state.label}
        />
      )}
      {state.isTouched && state.helperText && (
        <FormHelperText>{state.helperText}</FormHelperText>
      )}
      {showError && <div className="border-b-1 border-b-red-700"></div>}
    </FormControl>
  );
}
