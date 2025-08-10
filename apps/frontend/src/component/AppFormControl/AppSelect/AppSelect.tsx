import {
  Box,
  Chip,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useCtrl } from "../../../lib/SpoonKitReact/useCtrl";
import { generateRandomKey } from "../../../utils/generateRandomKey";
import { AppSelectCtrl } from "./AppSelectCtrl";

export function AppSelect({ ctrl }: { ctrl: AppSelectCtrl<any> }) {
  const { state, setState } = useCtrl(ctrl);
  const id = generateRandomKey();

  function handleSelectChange(e: SelectChangeEvent<any>) {
    const selectedKeyOrKeys = e.target.value;
    setState({ value: selectedKeyOrKeys });
  }

  function renderSelectValue(selected: any) {
    const hasNoSelection = state.multiple ? selected.length === 0 : !selected;

    if (hasNoSelection) {
      return <span style={{ color: "#999" }}>{state.placeholder}</span>;
    }

    if (state.multiple) {
      const selectedOptions = state.options.filter((opt) =>
        selected.includes(opt.id)
      );

      return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {selectedOptions.map((option) => (
            <Chip key={option.id} label={option.name} />
          ))}
        </Box>
      );
    } else {
      return state.options.find((opt) => opt.id === selected)?.name;
    }
  }

  return (
    <div className="relative w-full">
      <InputLabel
        id={`select-${id}-label-id`}
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
      <Select
        id={`select-${id}-id`}
        displayEmpty
        multiple={state.multiple}
        fullWidth={state.fullWidth}
        value={state.multiple ? state.value || [] : state.value || ""}
        renderValue={renderSelectValue}
        error={state.isTouched && !state.isValid}
        disabled={state.disabled}
        onBlur={() => setState({ isTouched: true })}
        onChange={handleSelectChange}
        size={state.size}
        variant={state.variant}
        sx={{
          "& .MuiFormHelperText-root.Mui-error": {
            color: "error.main",
            marginLeft: 0,
          },
        }}
      >
        <MenuItem value="" disabled={state.multiple}>
          <em style={{ color: "#999" }}>{state.placeholder}</em>
        </MenuItem>

        {state.options.filter(state.filterOptions).map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.name}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText
        error={state.isTouched && !state.isValid}
        sx={{
          transition: "color 0.3s, background-color 0.3s",
          padding: state.isTouched && !state.isValid ? "4px 8px" : 0,
          color:
            state.isTouched && !state.isValid
              ? "rgba(255, 0, 0, 0.9)"
              : state.isDirty
              ? "orange"
              : undefined,
          "&.MuiFormHelperText-root": {
            marginLeft: "-5px !important",
          },
        }}
      >
        {state.isTouched && state.helperText}
      </FormHelperText>
    </div>
  );
}
