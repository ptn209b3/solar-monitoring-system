import React from "react";
import ReactApexChart from "react-apexcharts";
import { Box, Typography } from "@mui/material";

export default function Last7dChart() {
  const options = {
    chart: { toolbar: { show: false }, zoom: { enabled: false } },
    xaxis: { type: "datetime" },
    grid: { show: false },
  };

  return (
    <Box padding={1}>
      <Typography color="primary.main" variant="h5">
        Production in Last 7 days
      </Typography>

      <ReactApexChart series={[]} height={300} options={options} />
    </Box>
  );
}
