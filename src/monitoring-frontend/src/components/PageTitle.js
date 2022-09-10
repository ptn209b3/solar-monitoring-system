import React from "react";

import { Typography, Divider } from "@mui/material";

export default function DefaultExport({ children }) {
  return (
    <React.Fragment>
      <Typography variant="h6" pt={2}>
        {children}
      </Typography>
      <Divider />
    </React.Fragment>
  );
}
