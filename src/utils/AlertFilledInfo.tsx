import React from "react";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

export default function FilledAlerts({ message }: { message: string }) {
  return (
    <Stack sx={{ width: "100%" }} spacing={2}>
      <Alert variant="filled" severity="info">
        {message}
      </Alert>
    </Stack>
  );
}
