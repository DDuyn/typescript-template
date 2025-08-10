import {
  Autocomplete,
  CircularProgress,
  InputLabel,
  TextField,
} from "@mui/material";
import { Fragment, SyntheticEvent, useEffect, useRef } from "react";
import { ResolveCtrl } from "../../lib/SpoonKitReact/ResolveCtrl";
import { useCtrl } from "../../lib/SpoonKitReact/useCtrl";
import { AppAutocompleteCtrl } from "./AppAutocompleteCtrl";

export function AppAutocomplete<T>({ ctrl }: { ctrl: AppAutocompleteCtrl<T> }) {
  const { state, setState } = useCtrl(ctrl);
  const debounceTimerRef = useRef(null);

  const handleChange = (_event: SyntheticEvent, newValue: T | T[] | null) => {
    setState({
      value: state.multiple
        ? newValue ?? []
        : Array.isArray(newValue)
        ? newValue[0] ?? null
        : newValue ?? null,
    });
  };

  const handleInputChange = (_event: SyntheticEvent, newInputValue: string) => {
    setState({ inputValue: newInputValue });

    // Implementar debounce para la carga asíncrona
    if (state.fetchOptions) {
      // Cancelar cualquier timer previo
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Configurar nuevo timer para cargar opciones después del período de debounce
      debounceTimerRef.current = setTimeout(() => {
        ctrl.loadOptions(newInputValue);
      }, state.debounceTimeout);
    }
  };

  // Limpiar el timer de debounce al desmontar el componente
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

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
      <Autocomplete
        multiple={state.multiple}
        options={state.options}
        getOptionLabel={state.getOptionLabel}
        value={
          state.multiple
            ? Array.isArray(state.value)
              ? state.value
              : state.value
              ? [state.value]
              : []
            : Array.isArray(state.value)
            ? state.value[0] ?? null
            : state.value ?? null
        }
        onChange={handleChange}
        inputValue={state.inputValue}
        isOptionEqualToValue={state.isOptionEqualToValue ?? ((a, b) => a === b)}
        onInputChange={handleInputChange}
        loading={state.loading}
        loadingText={state.loadingText}
        freeSolo={state.freeSolo}
        disabled={state.disabled}
        fullWidth={state.fullWidth}
        filterSelectedOptions={state.filterSelectedOptions}
        filterOptions={(x) => x}
        clearOnBlur={state.clearOnBlur}
        clearOnEscape={state.clearOnEscape}
        disableClearable={state.disableClearable}
        noOptionsText={state.noOptionsText}
        renderOption={(optionProps, option, { selected }) => (
          <li {...optionProps} key={state.getOptionLabel(option as T)}>
            <ResolveCtrl ctrl={state.mapOption(option as T, selected)} />
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            variant={state.variant}
            placeholder={state.placeholder}
            error={state.isTouched && !state.isValid}
            helperText={state.isTouched && state.helperText}
            onBlur={() => setState({ isTouched: true })}
            size={state.size}
            slotProps={{
              input: {
                ...params.InputProps,
                endAdornment: (
                  <Fragment>
                    {state.loading ? (
                      <CircularProgress
                        size={20}
                        sx={{ position: "relative", top: "-5px" }}
                      />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </Fragment>
                ),
              },
            }}
            sx={{
              "& .MuiFormHelperText-root.Mui-error": {
                color: "error.main",
                marginLeft: 0,
              },
            }}
          />
        )}
      />
    </div>
  );
}
