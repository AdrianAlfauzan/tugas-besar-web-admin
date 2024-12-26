import React from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
import { motion } from "framer-motion";

const AlertSuccess = ({ message }: { message: string }) => {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, x: 100 }} // Alert masuk dari kanan
      animate={{ opacity: 1, x: 0 }} // Alert tampak di tempat semula
      exit={{ opacity: 0, x: -100 }} // Alert keluar ke kiri
      transition={{ duration: 0.5 }}
    >
      <Stack spacing={2}>
        <Alert severity="success">
          <AlertTitle>{message}</AlertTitle>
          Selamat Anda Berhasil Memasukkan Data Dengan Benar!
        </Alert>
      </Stack>
    </motion.div>
  );
};

export default AlertSuccess;
