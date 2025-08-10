import {
  FormControlLabel,
  InputLabel,
  Radio,
  RadioGroup,
  SelectChangeEvent,
} from "@mui/material";
import { useCtrl } from "../../../lib/SpoonKitReact/useCtrl";
import { AppRadioCtrl } from "./AppRadioCtrl";

export function AppRadio({ ctrl }: { ctrl: AppRadioCtrl<any> }) {
  const { state, setState } = useCtrl(ctrl);
  function handleChange(e: SelectChangeEvent<any>) {
    let value = e.target.value;

    const isBooleanControl = state.options.some(
      (opt) => typeof opt.id === "boolean"
    );

    if (isBooleanControl) {
      value = value === "true";
    } else {
      value = Number(value);
    }

    setState({ value });
  }

  function getDisplayValue() {
    if (state.value === null || state.value === undefined) {
      return "";
    }
    return state.value.toString();
  }

  return (
    <div className="relative w-full">
      <InputLabel
        sx={{
          mb: 1,
          "&:before": state.required
            ? {
                content: '"* "',
                color: "error.main",
              }
            : {},
        }}
      >
        {state.label}
      </InputLabel>
      <RadioGroup row value={getDisplayValue()} onChange={handleChange}>
        {state.options.map((option) => (
          <FormControlLabel
            disabled={state.disabled}
            key={option.id.toString()}
            value={option.id}
            control={<Radio />}
            label={option.name}
          />
        ))}
      </RadioGroup>
    </div>
  );
}
