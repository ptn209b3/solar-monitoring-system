import dayjs from "dayjs";

function makeChartData(data, unit) {
  if (!data || !Array.isArray(data) || !data.length) return [];
  let valueArray = [];
  if (unit === "year") {
    let yearArray = data.map((point) => dayjs(point.timestamp).year());
    let maxYear = Math.max(...yearArray);
    let minYear = Math.min(...yearArray);
    let totalYears = maxYear - minYear + 1;
    valueArray = new Array(totalYears).fill(null);
    for (const point of data) {
      let year = dayjs(point.timestamp).year();
      let indexInArray = year - minYear;
      valueArray[indexInArray] = Math.round(point.value);
    }
  } else if (unit === "month") {
    valueArray = new Array(12).fill(null);
    for (const point of data) {
      let indexInArray = dayjs(point.timestamp).month(); // 0 => 11
      valueArray[indexInArray] = Math.round(point.value);
    }
  } else if (unit === "day") {
    let sampleDate = dayjs(data[0].timestamp);
    let daysInMonth = sampleDate.daysInMonth();
    valueArray = new Array(daysInMonth).fill(null);
    for (const point of data) {
      let dateOfMonth = dayjs(point.timestamp).date(); // 1 => 31
      let indexInArray = dateOfMonth - 1; // 0 => 30
      valueArray[indexInArray] = Math.round(point.value);
    }
  } else if (unit === "hour") {
    valueArray = new Array(24).fill(null);
    for (const point of data) {
      let indexInArray = dayjs(point.timestamp).hour(); // 0 => 23
      valueArray[indexInArray] = Math.round(point.value);
    }
  } else if (unit === "minute") {
    valueArray = new Array(60).fill(null);
    for (const point of data) {
      let indexInArray = dayjs(point.timestamp).minute(); // 0 => 59
      valueArray[indexInArray] = Math.round(point.value);
    }
  } else if (unit === "second") {
    valueArray = new Array(60).fill(null);
    for (const point of data) {
      let indexInArray = dayjs(point.timestamp).second(); // 0 => 59
      valueArray[indexInArray] = Math.round(point.value);
    }
  }
  return valueArray;
}

function makeChartLabel(data, unit) {
  if (!data || !Array.isArray(data) || !data.length) return [];
  let valueArray = [];
  if (unit === "year") {
    let yearArray = data.map((point) => dayjs(point.timestamp).year());
    let maxYear = Math.max(...yearArray);
    let minYear = Math.min(...yearArray);
    for (let i = minYear; i <= maxYear; i++) {
      valueArray.push(i);
    }
  } else if (unit === "month") {
    valueArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  } else if (unit === "day") {
    let sampleDate = dayjs(data[0].timestamp);
    let daysInMonth = sampleDate.daysInMonth();
    valueArray = [...Array(daysInMonth + 1).keys()].slice(1);
  } else if (unit === "hour") {
    valueArray = [...Array(24).keys()];
  } else if (unit === "minute" || unit === "second") {
    valueArray = [...Array(60).keys()];
  }
  return valueArray;
}

export { makeChartData, makeChartLabel };
