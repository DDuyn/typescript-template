import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useRef, useState } from "react";
import { ResolveCtrl } from "../../lib/SpoonKitReact/ResolveCtrl";
import { useCtrl } from "../../lib/SpoonKitReact/useCtrl";
import { AppSectionCtrl } from "./AppSectionCtrl";
import { Divider } from "@mui/material";

export function AppSection({ ctrl }: { ctrl: AppSectionCtrl }) {
  const { self, state, setState } = useCtrl(ctrl);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Actualizar la altura cuando cambia el contenido o el estado de expansión
  useEffect(() => {
    if (contentRef.current && state.expanded) {
      setContentHeight(contentRef.current.scrollHeight);

      // Crear un ResizeObserver para detectar cambios en el tamaño del contenido
      resizeObserverRef.current = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (state.expanded) {
            setContentHeight(entry.target.scrollHeight);
          }
        }
      });

      // Observar el elemento de contenido
      resizeObserverRef.current.observe(contentRef.current);
    } else {
      setContentHeight(0);
    }

    // Limpieza al desmontar
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [state.expanded]);

  const handleToggle = () => {
    const newExpandedState = !state.expanded;
    setState({ expanded: newExpandedState });
    self.onChange.next(newExpandedState);
  };

  return (
    <div
      className={`
        overflow-hidden py-1
        ${!state.borderless && "border border-gray-200 rounded"} 
      `}
    >
      <div
        className={`flex items-center p-0.5 pl-2 ${
          state.disabled ? "cursor-default" : "cursor-pointer"
        } ${!state.borderless ? "bg-gray-50" : ""} ${
          state.expanded && !state.borderless ? "border-b border-gray-200" : ""
        } select-none`}
        onClick={state.disabled ? undefined : handleToggle}
      >
        <button
          className={`mr-1 p-1 transition-transform duration-200 ${
            state.expanded ? "rotate-180" : "rotate-0"
          } ${state.disabled ? "opacity-50" : ""}`}
          onClick={(e) => {
            if (!state.disabled) {
              e.stopPropagation();
              handleToggle();
            }
          }}
          disabled={state.disabled}
        >
          <ExpandMoreIcon className="w-5 h-5" />
        </button>

        <h3
          style={{
            color: "background: rgba(41, 41, 41, 1)",
            fontWeight: 600,
            fontSize: "16px",
            lineHeight: "16px",
            letterSpacing: "0px",
          }}
        >
          {state.title}
        </h3>
        {!state.isValid && (
          <i className="ml-1 ri-error-warning-fill text-red-600"></i>
        )}
        {state.isValid && state.isDirty && (
          <i className="ml-1 ri-edit-2-fill text-orange-400"></i>
        )}
      </div>
      {/* Contenedor animado para el contenido */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: `${contentHeight}px` }}
      >
        <div
          ref={contentRef}
          className={`${!state.borderless ? "p-4" : "pt-2 pl-4"}`}
        >
          <ResolveCtrl ctrl={state.content} />
          <Divider />
        </div>
      </div>
    </div>
  );
}
