import React from "react";

import { Box, Typography, Paper, Stack } from "@mui/material";
import loginBackground from "../images/login.jpg";

export default function LoginCheck() {
  return (
    <Box
      flex={1}
      height={1}
      bgcolor="background.default"
      overflow="auto"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ background: `url(${loginBackground}) center` }}
    >
      <Paper elevation={6}>
        <Stack spacing={2} padding={2} height={420} width={320}>
          <Typography variant="h5">Checking authentication....</Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
