import React from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";

export default function AlertKelayakanSuccess({ message }: { message: string }) {
  return (
    <Box sx={{ width: "100%" }}>
      <Alert severity="info" sx={{ mb: 2 }} className="my-4">
        {message}
      </Alert>
    </Box>
  );
}
