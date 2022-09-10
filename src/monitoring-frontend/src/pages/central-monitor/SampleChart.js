import Chart from "react-apexcharts";

const series = [
  { name: "Example1", data: [30, 40, 35, 50, 49, 60, 70, 91, 125] },
  { name: "Example2", data: [29, 35, 25, 45, 39, 55, 60, 80, 100] },
];

const options = {
  chart: {
    id: "example chart",
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  tooltip: { enabled: false },
  legend: { show: false },
  xaxis: { labels: { show: false } },
  yaxis: { labels: { show: false } },
};

export default function SampleChart() {
  return <Chart options={options} series={series} />;
}
