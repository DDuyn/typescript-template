import { InputLabel } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { es } from "date-fns/locale";
import { useCtrl } from "../../../lib/SpoonKitReact/useCtrl";
import "./AppDatePicker.css";
import { AppDatePickerCtrl } from "./AppDatePickerCtrl";

export function AppDatePicker({ ctrl }: { ctrl: AppDatePickerCtrl }) {
  const { state, setState } = useCtrl(ctrl);
  const showError = state.isTouched && !state.isValid;

  // Determinar el color de fondo según el estado
  const getBackgroundColor = () => {
    if (state.isTouched && !state.isValid) {
      return "rgba(255, 0, 0, 0.05)"; // Rojo muy claro cuando no es válido
    } else if (state.isDirty) {
      return "rgba(255, 165, 0, 0.15)"; // Naranja claro cuando está modificado
    } else {
      return "rgba(0, 0, 0, 0.03)"; // Gris claro en estado normal
    }
  };

  // Determinar el color de fondo en hover según el estado
  const getHoverBackgroundColor = () => {
    if (state.isTouched && !state.isValid) {
      return "rgba(255, 0, 0, 0.08)"; // Rojo claro hover cuando no es válido
    } else if (state.isDirty) {
      return "rgba(255, 165, 0, 0.15)"; // Naranja claro hover cuando está modificado
    } else {
      return "rgba(0, 0, 0, 0.05)"; // Gris claro hover en estado normal
    }
  };

  // Determinar el color de fondo cuando está enfocado según el estado
  const getFocusedBackgroundColor = () => {
    if (state.isTouched && !state.isValid) {
      return "rgba(255, 0, 0, 0.1)"; // Rojo claro focus cuando no es válido
    } else if (state.isDirty) {
      return "rgba(255, 165, 0, 0.2)"; // Naranja claro focus cuando está modificado
    } else {
      return "rgba(0, 0, 0, 0.06)"; // Gris claro focus en estado normal
    }
  };

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
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
        <DatePicker
          value={state.value || null}
          onChange={(newValue) => setState({ value: newValue as any })}
          format={state.format}
          minDate={state.minDate}
          maxDate={state.maxDate}
          disablePast={state.disablePast}
          disableFuture={state.disableFuture}
          readOnly={state.readOnly || state.disabled}
          disabled={state.disabled}
          slots={{
            openPickerIcon: () => <i className="ri-calendar-line text-lg"></i>,
          }}
          slotProps={{
            textField: {
              variant: state.variant,
              size: state.size,
              error: showError,
              fullWidth: true,
              placeholder: state.placeholderText,
              onBlur: () => setState({ isTouched: true }),
              helperText: state.isTouched && state.helperText,
              sx: {
                "& .MuiFormHelperText-root.Mui-error": {
                  color: "error.main",
                  marginLeft: 0,
                },
                "& .MuiOutlinedInput-root": {
                  backgroundColor: getBackgroundColor(),
                  "&:hover": {
                    backgroundColor: getHoverBackgroundColor(),
                  },
                  "&.Mui-focused": {
                    backgroundColor: getFocusedBackgroundColor(),
                  },
                },
              },
            },
          }}
        />
      </LocalizationProvider>
    </div>
  );
}
