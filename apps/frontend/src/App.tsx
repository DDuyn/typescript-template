import { Login } from "@pages/auth/login/login";
import { HashRouter, Route, Routes } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<AppRoutes />} />
      </Routes>
    </HashRouter>
  );
}

export default App;

/*
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<PrivateRoutes />}>
          <Route path="/*" element={<AppRoutes />} />
        </Route>
      </Routes>
    </HashRouter>
  );*/
