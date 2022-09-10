import React from "react";
import ReactApexChart from "react-apexcharts";

function GenericChart({ series = [], options }) {
  return <ReactApexChart options={options} series={series} height="100%" />;
}

export default GenericChart;
