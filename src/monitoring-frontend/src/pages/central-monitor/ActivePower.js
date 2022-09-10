import React from "react";
import ReactApexChart from "react-apexcharts";
import { Box, Typography } from "@mui/material";

function ActivePower(props) {
  const mode = "dark";

  // const series = [
  //   {
  //     name: "Irradiance",
  //     data: [
  //       { x: "2022-01-19T00:00:00", y: 0 },
  //       { x: "2022-01-19T01:00:00", y: 0 },
  //       { x: "2022-01-19T02:00:00", y: 0 },
  //       { x: "2022-01-19T03:00:00", y: 0 },
  //       { x: "2022-01-19T04:00:00", y: 0 },
  //       { x: "2022-01-19T05:00:00", y: 0 },
  //       { x: "2022-01-19T06:00:00", y: 0 },
  //       { x: "2022-01-19T07:00:00", y: 0 },
  //       { x: "2022-01-19T08:00:00", y: 240 },
  //       { x: "2022-01-19T09:00:00", y: 530 },
  //       { x: "2022-01-19T10:00:00", y: 737 },
  //       { x: "2022-01-19T10:30:00", y: 643 },
  //       { x: "2022-01-19T11:00:00", y: 276 },
  //       { x: "2022-01-19T11:30:00", y: 500 },
  //       { x: "2022-01-19T12:00:00", y: 596 },
  //       { x: "2022-01-19T13:00:00", y: 723 },
  //       { x: "2022-01-19T14:00:00", y: 519 },
  //       { x: "2022-01-19T15:00:00", y: 350 },
  //       { x: "2022-01-19T16:00:00", y: 269 },
  //       { x: "2022-01-19T16:00:00", y: 82 },
  //     ],
  //   },
  //   {
  //     name: "Active Power",
  //     data: [
  //       { x: "2022-01-19T00:00:00", y: 0 },
  //       { x: "2022-01-19T01:00:00", y: 0 },
  //       { x: "2022-01-19T02:00:00", y: 0 },
  //       { x: "2022-01-19T03:00:00", y: 0 },
  //       { x: "2022-01-19T04:00:00", y: 0 },
  //       { x: "2022-01-19T05:00:00", y: 0 },
  //       { x: "2022-01-19T06:00:00", y: 0 },
  //       { x: "2022-01-19T07:00:00", y: 0 },
  //       { x: "2022-01-19T08:00:00", y: 219 },
  //       { x: "2022-01-19T09:00:00", y: 477 },
  //       { x: "2022-01-19T10:00:00", y: 654 },
  //       { x: "2022-01-19T10:30:00", y: 629 },
  //       { x: "2022-01-19T11:00:00", y: 286 },
  //       { x: "2022-01-19T11:30:00", y: 339 },
  //       { x: "2022-01-19T12:00:00", y: 386 },
  //       { x: "2022-01-19T13:00:00", y: 725 },
  //       { x: "2022-01-19T14:00:00", y: 693 },
  //       { x: "2022-01-19T15:00:00", y: 448 },
  //       { x: "2022-01-19T16:00:00", y: 286 },
  //       { x: "2022-01-19T16:00:00", y: 85 },
  //     ],
  //   },
  // ];

  // const series7days = [
  //   {
  //     name: "Production",
  //     data: [
  //       { x: "2022-02-24", y: 4.63 },
  //       { x: "2022-02-25", y: 4.43 },
  //       { x: "2022-02-26", y: 6.14 },
  //       { x: "2022-02-27", y: 6.28 },
  //       { x: "2022-02-28", y: 6.19 },
  //       { x: "2022-03-01", y: 5.85 },
  //       { x: "2022-03-02", y: 0 },
  //     ],
  //   },
  // ];

  const options =
    mode === "light"
      ? {
          chart: { toolbar: { show: false }, zoom: { enabled: false } },
          theme: { mode: "light" },
          xaxis: { type: "datetime" },
          grid: { show: false },
        }
      : {
          chart: { toolbar: { show: false }, zoom: { enabled: false } },
          theme: { mode: "dark" },
          xaxis: { type: "datetime" },
          grid: { show: false },
        };

  return (
    <Box px={2} bgcolor="background.default">
      <Typography sx={{ color: "primary.main" }} variant="h5">
        Power Curve in Last 24 Hours
      </Typography>

      <ReactApexChart
        series={[]}
        // type="area"
        height={300}
        options={options}
      />

      <Typography sx={{ color: "primary.main" }} variant="h5">
        Production in Last 7 days
      </Typography>

      <ReactApexChart
        series={[]}
        type="bar"
        height={300}
        options={{
          ...options,
        }}
      />
    </Box>
  );
}

export default ActivePower;
