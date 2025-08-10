import { Ctrl } from "../../lib/SpoonKit/controller/Ctrl";
import { calc } from "../../lib/SpoonKit/signals/Calc";
import { state, State } from "../../lib/SpoonKit/signals/State";
import { AppCheckboxCtrl } from "../AppFormControl/AppCheckbox/AppCheckboxCtrl";

interface Column {
  id: string;
  align?: "center" | "left" | "right" | "inherit";
  label: string;
  minWidth?: string | number;
  sortable?: boolean;
}

type RowModel = {
  [key: string]: Ctrl;
};

interface Row<T> {
  key: string | number;
  selectCheckbox: AppCheckboxCtrl;
  model: RowModel;
  value: T;
}

export abstract class AppTableCtrl<T> extends Ctrl {
  abstract columns: State<Column[]>;
  abstract canSelectRow: State<boolean>;
  abstract canPaginate: State<boolean>;

  isLoading = state(false);
  rowsPerPage = state(9);
  rowsPerPageOptions = state([9, 18, 26, 50]);
  page = state(0);
  count = state(0);

  // Sorting state
  sortBy = state<string | null>(null);
  sortDirection = state<"asc" | "desc">("asc");

  rows = state<Row<T>[]>([]);
  selectedRows = calc(() => {
    const rows = this.rows.get();
    return rows?.filter((row) => row.selectCheckbox.value.get());
  });

  allRowsCheckbox = new AppCheckboxCtrl().set({
    value: false,
    fullWidth: false,
    indeterminate: calc(() => {
      const rows = this.rows.get();
      const selectedRows = this.selectedRows.get();
      return selectedRows?.length > 0 && selectedRows?.length < rows.length;
    }),
    onChange: (value: boolean) => {
      // TODO: This still has errors
      // Cuando se cambia entre páginas, el checkbox de "Seleccionar todo" deselecciona todo
      // Revisar onChange de AppFormControl
      this.rows.get().forEach((row) => {
        row.selectCheckbox.value.set(value);
      });
    },
  });

  protected abstract buildRow(item: T, index: number): RowModel;
  protected abstract rowKeyFn: (item: T) => string | number;

  private indexedRows = new Map<string | number, Row<T>>();

  public handleColumnHeaderClick(columnId: string) {
    const columns = this.columns.get();
    const column = columns.find((col) => col.id === columnId);

    // Only allow sorting if the column is sortable
    if (!column || !column.sortable) {
      return;
    }

    const currentSortBy = this.sortBy.get();
    const currentDirection = this.sortDirection.get();

    if (currentSortBy === columnId) {
      // Toggle direction if sorting by the same column
      this.sortDirection.set(currentDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new column and default to ascending
      this.sortBy.set(columnId);
      this.sortDirection.set("asc");
    }

    // Reset to first page when sorting changes
    this.page.set(0);
  }

  public getColumnSortState(columnId: string): {
    isSorted: boolean;
    direction: "asc" | "desc" | null;
  } {
    const currentSortBy = this.sortBy.get();
    const currentDirection = this.sortDirection.get();

    return {
      isSorted: currentSortBy === columnId,
      direction: currentSortBy === columnId ? currentDirection : null,
    };
  }

  public getData(): T[] {
    return this.rows.get().map((row) => row.value);
  }

  public setData(data: T[]) {
    // Clear the cache to ensure fresh data rendering
    this.indexedRows.clear();

    const rows = data?.map((item, i) => {
      const key = this.rowKeyFn(item);

      const row = {
        key,
        value: item,
        model: this.buildRow(item, i),
        selectCheckbox: new AppCheckboxCtrl().set({
          value: false,
          fullWidth: false,
        }),
      };

      this.indexedRows.set(key, row);
      return row;
    });

    this.rows.set(rows);
  }
}
