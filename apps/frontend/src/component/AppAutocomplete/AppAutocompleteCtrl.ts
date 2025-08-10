import { Ctrl } from "../../lib/SpoonKit/controller/Ctrl";
import { state } from "../../lib/SpoonKit/signals/State";
import { AppFormControl } from "../AppFormControl/AppFormControl";

export class AppAutocompleteCtrl<T> extends AppFormControl<T | T[]> {
  options = state<T[]>([]);
  loading = state<boolean>(false);
  multiple = state<boolean>(false);
  freeSolo = state<boolean>(false);
  size = state<"small" | "medium">("small");
  placeholder = state<string>("Buscar...");
  noOptionsText = state<string>("No hay resultados");
  loadingText = state<string>("Cargando...");
  clearOnBlur = state<boolean>(true);
  clearOnEscape = state<boolean>(true);
  disableClearable = state<boolean>(false);
  filterSelectedOptions = state<boolean>(false);
  inputValue = state<string>("");
  prefetchOptions = state<boolean>(true);
  debounceTimeout = state<number>(200); // Tiempo para debounce en ms
  isOptionEqualToValue = state<(option: T, value: T) => boolean>();
  variant = state<"outlined" | "filled" | "standard">("outlined");
  required = state<boolean>(false);

  getOptionLabel = state<(option: T) => string>();
  mapOption = state<(option: T, selected: boolean) => Ctrl>();

  // Función que carga opciones asincrónicamente
  fetchOptions = state<(query: string) => Promise<T[]>>();

  // Método para cargar opciones asincrónicamente
  async loadOptions(query: string): Promise<void> {
    if (!this.fetchOptions.get()) {
      return;
    }

    try {
      this.loading.set(true);
      const loadedOptions = await this.fetchOptions.get()(query);
      this.options.set(loadedOptions);
    } catch (error) {
      console.error("Error cargando opciones:", error);
      this.options.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  constructor() {
    super();

    this.onStart.subscribe(() => {
      if (this.prefetchOptions.get()) {
        this.loadOptions("");
      }
    });
  }
}
