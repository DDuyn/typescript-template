import { ConfirmEmail } from "@/pages/auth/ConfirmEmail";
import { Box, Typography } from "@mui/material";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const Home = () => (
  <Box p={4}>
    <Typography variant="h4">Bienvenido</Typography>
    <Typography>Esta es la pantalla de inicio (mock).</Typography>
  </Box>
);

const ErrorPage = () => (
  <Box p={4}>
    <Typography variant="h5">404 - Página no encontrada</Typography>
  </Box>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/auth/confirm",
    element: <ConfirmEmail />,
    errorElement: <ErrorPage />,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
