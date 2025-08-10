import { InputLabel, TextField, Typography } from "@mui/material";
import { useCtrl } from "../../../lib/SpoonKitReact/useCtrl";
import { AppTextAreaCtrl } from "./AppTextAreaCtrl";

export function AppTextArea({ ctrl }: { ctrl: AppTextAreaCtrl }) {
  const { state, setState } = useCtrl(ctrl);

  return (
    <div className="relative w-full">
      <div className="flex justify-between items-center mb-1">
        <InputLabel
          sx={{
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

        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
          }}
        >
          {state.value ? state.value.length : 0} / {state.maxLength}
        </Typography>
      </div>
      <TextField
        multiline
        minRows={state.minRows}
        maxRows={state.maxRows}
        disabled={state.disabled}
        fullWidth
        helperText={state.isTouched && state.helperText}
        error={state.isTouched && !state.isValid}
        value={state.value ?? ""}
        onChange={(e) => setState({ value: e.target.value })}
        variant={state.variant}
        placeholder={state.placeholder}
        size={state.size}
        sx={{
          "& .MuiFormHelperText-root.Mui-error": {
            color: "error.main",
            marginLeft: 0,
          },
        }}
      />
    </div>
  );
}
