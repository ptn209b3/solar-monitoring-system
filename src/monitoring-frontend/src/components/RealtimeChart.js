import React from "react";
import ReactApexChart from "react-apexcharts";

import { useIoT } from "../lib/iot-lib";

const XAXISRANGE = 60 * 1000;

const refOpt = {
  chart: {
    animations: {
      enabled: true,
      easing: "linear",
      dynamicAnimation: { speed: 1000 },
    },
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  dataLabels: { enabled: false },
  stroke: { curve: "smooth" },
  markers: { size: 0 },
  xaxis: {
    type: "datetime",
    range: XAXISRANGE,
  },
  // yaxis: { max: 300 },
  legend: { show: false },
};

export default function RealtimeChart({ entityId, field }) {
  const { data } = useIoT(`telemetry.${entityId}.${field}`);

  const [dataArray, setDataArray] = React.useState([]);

  React.useEffect(() => {
    if (data)
      setDataArray(
        [...dataArray, { y: data.value, x: data.timestamp }].slice(-30)
      );

    // eslint-disable-next-line
  }, [data]);
  const series = [{ name: field, data: dataArray }];
  const options = {
    ...refOpt,
    title: { text: field, align: "center" },
  };

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="line"
      height="100%"
    />
  );
}
