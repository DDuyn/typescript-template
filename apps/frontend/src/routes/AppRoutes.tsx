import { Navigate, Route, Routes } from "react-router-dom";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
/*<Route element={<PrivateRoutes />}>
        <Route element={<RootLayout />}></Route>
      </Route>*/
