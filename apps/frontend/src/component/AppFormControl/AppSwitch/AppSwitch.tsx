import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Switch,
} from "@mui/material";
import { useCtrl } from "../../../lib/SpoonKitReact/useCtrl";
import { AppSwitchCtrl } from "./AppSwitchCtrl";

export function AppSwitch({ ctrl }: { ctrl: AppSwitchCtrl }) {
  const { state, setState } = useCtrl(ctrl);
  const showError = state.isTouched && !state.isValid;

  return (
    <FormControl
      fullWidth={state.fullWidth}
      error={showError}
      component="fieldset"
      className={showError ? "bg-red-50 rounded-t-md" : ""}
    >
      {!state.label && (
        <Switch
          checked={!!state.value}
          onChange={(_, checked) => setState({ value: checked })}
          onBlur={() => setState({ isTouched: true })}
          disabled={state.disabled}
          color={state.color}
          size={state.size}
        />
      )}
      {state.label && (
        <FormControlLabel
          className="px-2"
          control={
            <Switch
              checked={!!state.value}
              onChange={(_, checked) => setState({ value: checked })}
              onBlur={() => setState({ isTouched: true })}
              disabled={state.disabled}
              color={state.color}
              size={state.size}
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
