import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

import { Box, Stack, Typography } from "@mui/material";

export default function OverviewToday(props) {
  return (
    <Box px={2}>
      <Typography sx={{ color: "primary.main" }} variant="h5">
        Overview Today
      </Typography>
      <Stack direction="row">
        <Stack sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
            <CircularProgress variant="determinate" value={0} size={128} />
          </Box>
          <Typography align="center" variant="h6">
            Active Power
          </Typography>
        </Stack>
        <Stack sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
            <CircularProgress variant="determinate" value={0} size={128} />
          </Box>
          <Typography align="center" variant="h6">
            Production Today
          </Typography>
        </Stack>
        <Stack sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
            <CircularProgress variant="determinate" value={0} size={128} />
          </Box>
          <Typography align="center" variant="h6">
            CO₂ Reduction Today
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
