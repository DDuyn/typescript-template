import { Tab, Tabs } from "@mui/material";
import { useCtrl } from "../../lib/SpoonKitReact/useCtrl";
import { AppTabsCtrl } from "./AppTabsCtrl";
import { ResolveCtrl } from "../../lib/SpoonKitReact/ResolveCtrl";

const lowercaseStyle = {
  textTransform: "capitalize",
  minHeight: "32px",
  padding: "6px 12px",
  fontSize: "0.875rem",
};

const tabsStyle = {
  minHeight: "32px",
};

export function AppTabs({ ctrl }: { ctrl: AppTabsCtrl }) {
  const { self, state, setState } = useCtrl(ctrl);

  const handleChange = (_: any, newIndex: number) => {
    setState({ selectedIndex: newIndex });
    self.onChange.next(newIndex);
  };

  return (
    <>
      <div className="w-full border-b border-gray-200">
        <Tabs
          value={state.selectedIndex}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={tabsStyle}
        >
          {state.tabs?.map((tab, idx) => (
            <Tab
              key={idx}
              label={tab.label}
              disabled={tab.disabled}
              value={idx}
              sx={lowercaseStyle}
            />
          ))}
        </Tabs>
      </div>
      <ResolveCtrl ctrl={state.selectedContent} />
    </>
  );
}
