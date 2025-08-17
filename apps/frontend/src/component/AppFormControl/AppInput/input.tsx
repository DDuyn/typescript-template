import { useCtrl } from "@lib/SpoonKitReactComposition/useCtrl";
import { InputAdornment, InputLabel, TextField } from "@mui/material";
import { createInputCtrl } from "./input.ctrl";

export function Input({ ctrl }: { ctrl: ReturnType<typeof createInputCtrl> }) {
  const { state, setState } = useCtrl(() => ctrl);

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
      <TextField
        variant={state.variant}
        type={state.type}
        placeholder={state.placeholder}
        fullWidth
        helperText={state.helperText}
        error={!state.isValid}
        disabled={state.disabled}
        value={state.value ?? ""}
        onChange={(e: any) => setState({ value: e.target.value })}
        size={state.size}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                {state.endAdornment}
              </InputAdornment>
            ),
          },
        }}
        sx={{
          "& .MuiInputBase-root.Mui-disabled": {
            backgroundColor: "#f3f4f6",
          },
          "& .MuiFormHelperText-root.Mui-error": {
            color: "error.main",
            marginLeft: 0,
          },
        }}
      />
    </div>
  );
}
