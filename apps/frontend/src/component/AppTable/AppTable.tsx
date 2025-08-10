import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { ResolveCtrl } from "../../lib/SpoonKitReact/ResolveCtrl";
import { useCtrl } from "../../lib/SpoonKitReact/useCtrl";
import { AppCheckbox } from "../AppFormControl/AppCheckbox/AppCheckbox";
import { AppTableCtrl } from "./AppTableCtrl";

const LoadingSpinner = () => (
  <Box
    sx={{
      display: "flex",
      marginTop: "50px",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      zIndex: 9999,
    }}
  >
    <CircularProgress size={60} thickness={4} />
  </Box>
);

export function AppTable({ ctrl }: { ctrl: AppTableCtrl<any> }) {
  const { self, state, setState } = useCtrl(ctrl);

  return (
    <>
      <TableContainer>
        <Table stickyHeader={true}>
          <TableHead>
            <TableRow>
              {state.canSelectRow && (
                <TableCell key="select" align="left" width={50} sx={{ p: 0 }}>
                  <AppCheckbox ctrl={self.allRowsCheckbox} />
                </TableCell>
              )}
              {state.columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || "left"}
                  style={{ width: column.minWidth, fontWeight: "bold" }}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={state.sortBy === column.id}
                      direction={
                        state.sortBy === column.id ? state.sortDirection : "asc"
                      }
                      onClick={() => self.handleColumnHeaderClick(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {state.isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={state.columns.length + (state.canSelectRow ? 1 : 0)}
                >
                  <LoadingSpinner />
                </TableCell>
              </TableRow>
            ) : (
              state.rows?.map((row) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.key ?? Math.random().toString(36).substring(2, 15)}
                    onClick={() => self["onRowClick"]?.(row)}
                    sx={{
                      cursor: self["onRowClick"] ? "pointer" : "default",
                    }}
                  >
                    {state.canSelectRow && (
                      <TableCell
                        key="select"
                        align="left"
                        width={50}
                        sx={{ p: 0 }}
                      >
                        <AppCheckbox ctrl={row.selectCheckbox} />
                      </TableCell>
                    )}
                    {state.columns.map((column) => {
                      const value = row.model[column.id];
                      if (!value) {
                        throw `Column id '${column.id}' not found in rowModel `;
                      }
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align || "left"}
                          style={{ width: column.minWidth }}
                        >
                          <ResolveCtrl ctrl={value}></ResolveCtrl>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {state.canPaginate && (
        <TablePagination
          labelRowsPerPage="Registros por página: "
          labelDisplayedRows={({ page, count }) =>
            `${page + 1} de ${Math.ceil(count / state.rowsPerPage)} páginas`
          }
          rowsPerPageOptions={state.rowsPerPageOptions}
          component="div"
          count={state.count}
          rowsPerPage={state.rowsPerPage}
          page={state.page}
          onPageChange={(_, page) => setState({ page })}
          onRowsPerPageChange={(e) =>
            setState({ page: 0, rowsPerPage: parseInt(e.target.value) })
          }
        />
      )}
    </>
  );
}
