import { Box, Typography } from "@mui/material";
import { useEffect } from "react";

export const ConfirmEmail = () => {
  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace("#", ""));
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    console.log("📩 Tokens recibidos:");
    console.log({ accessToken, refreshToken });

    // Aquí podrías: setear cookies vía backend, mostrar loading, etc.
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        ✅ Correo confirmado
      </Typography>
      <Typography variant="body1">Redirigiendo al panel...</Typography>
    </Box>
  );
};
