export function getTimestamp(params) {
  let date = new Date(parseInt(params.row.id.slice(0, 8), 16) * 1000);
  return date.toLocaleString("vi-VN");
}
export function getValue(params) {
  if (params.value) return params.value.value;
  else return "N/A";
}

export const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};

export const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
};
