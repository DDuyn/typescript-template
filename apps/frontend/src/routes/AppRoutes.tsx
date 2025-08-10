import { Navigate, Route, Routes } from "react-router-dom";
import { RootLayout } from "../layouts/RootLayout";
import { Home } from "../pages/Home/Home";
import { MyProfile } from "../pages/MyProfile/MyProfile";
import { Opportunity } from "../pages/Opportunities/Create/Opportunity";
import { Opportunities } from "../pages/Opportunities/Opportunities";
import { Proposal } from "../pages/Proposals/Proposal/Proposal";
import { PrivateRoutes } from "./PrivateRoutes";
import { Users } from "../pages/Users/Users";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PrivateRoutes />}>
        <Route element={<RootLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/opportunity" element={<Opportunity />} />
          <Route path="/opportunity/:id" element={<Opportunity />} />
          <Route path="/proposal" element={<Proposal />} />
          <Route path="/users" element={<Users />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
