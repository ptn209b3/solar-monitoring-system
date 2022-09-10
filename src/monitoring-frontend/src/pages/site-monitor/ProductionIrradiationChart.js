import React from "react";
import ReactApexChart from "react-apexcharts";

const options = {
  chart: {
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  yaxis: [
    { title: { text: "Production (kWh)" } },
    { opposite: true, title: { text: "Irradiation (Wh/m\u00B2)" } },
  ],
  xaxis: {
    type: "datetime",
  },
};

export default function ProductionIrradiationChart({
  production = [],
  irradiation = [],
}) {
  const series = [
    { name: "Production", data: production },
    { name: "Irradiation", data: irradiation },
  ];

  return <ReactApexChart options={options} series={series} height="100%" />;
}
