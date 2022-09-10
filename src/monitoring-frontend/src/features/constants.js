const timeUnitOptions = [
  { value: "year", label: "Yearly" },
  { value: "month", label: "Monthly" },
  { value: "day", label: "Daily" },
  { value: "hour", label: "Hourly" },
  { value: "minute", label: "Minutely" },
  { value: "second", label: "Secondly" },
  // { value: "quarter", label: "Quarterly" },
  // { value: "week", label: "Weekly" },
  // { value: "millisecond", label: "Millisecondly" },
];

const operators = [
  { value: "avg", label: "Avg" },
  { value: "first", label: "First" },
  { value: "last", label: "Last" },
  { value: "max", label: "Max" },
  { value: "min", label: "Min" },
  { value: "integral", label: "Integral" },
  { value: "derivative", label: "Derivative" },
  { value: "all", label: "All" },
];

let pickerUnitOptions = {
  year: null,
  month: "year",
  day: "month",
  hour: "day",
  minute: "hours",
  second: "minutes",
};

export { timeUnitOptions, operators, pickerUnitOptions };
