import React from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";

const AlertSuccess = ({ message }: { message: string }) => {
  return (
    <div className="fixed top-0 left-0 z-50">
      <Stack
        sx={{
          width: "100%",
          animation: "slideInFromTopLeft 0.8s ease-out",
        }}
        spacing={2}
      >
        <Alert severity="success">
          <AlertTitle>{message}</AlertTitle>
          Selamat Anda Berhasil Memasukkan Data Dengan Benar!
        </Alert>
      </Stack>
    </div>
  );
};

export default AlertSuccess;
