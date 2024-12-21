// src/utils/Loader.tsx
import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

type LoaderProps = {
  size?: number;
};

const Loader = ({ size = 20 }: LoaderProps) => {
  return (
    <Box sx={{ display: "flex" }}>
      <CircularProgress size={size} />
    </Box>
  );
};

export default Loader;
