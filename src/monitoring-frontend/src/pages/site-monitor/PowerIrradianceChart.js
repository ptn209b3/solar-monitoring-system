import React from "react";
import ReactApexChart from "react-apexcharts";

const options = {
  chart: {
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  yaxis: [
    { title: { text: "Power (kW)" } },
    { opposite: true, title: { text: "Irradiance (W/m\u00B2)" } },
  ],
  xaxis: {
    type: "datetime",
  },
};

export default function PowerIrradianceChart({ power = [], irradiance = [] }) {
  const series = [
    { name: "Power", data: power },
    { name: "Irradiance", data: irradiance },
  ];

  return <ReactApexChart options={options} series={series} height="100%" />;
}
