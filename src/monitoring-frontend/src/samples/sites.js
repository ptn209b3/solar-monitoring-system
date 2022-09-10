export const sites = [
  {
    _id: 1,
    type: "Site",
    name: { type: "string", value: "Site 1" },

    capacity: {
      type: "number",
      value: Math.floor(Math.random() * 1000),
      unit: "kWh",
    },
    production: {
      type: "number",
      value: Math.floor(Math.random() * 1000),
      unit: "MWp",
    },
    irradiation: {
      type: "number",
      value: Math.floor(Math.random() * 1000),
      unit: "Wh/m2",
    },
    powerRatio: {
      type: "number",
      value: Math.floor(Math.random() * 100),
      unit: "%",
    },
    activePower: {
      type: "number",
      value: Math.floor(Math.random() * 1000),
      unit: "kW",
    },
    operatingState: {
      type: "string",
      value: "normal",
    },
  },
  {
    _id: 2,
    type: "Site",
    name: { type: "string", value: "Site 2" },
    capacity: {
      type: "number",
      value: Math.floor(Math.random() * 1000),
      unit: "kWh",
    },
    production: {
      type: "number",
      value: Math.floor(Math.random() * 1000),
      unit: "MWp",
    },
    irradiation: {
      type: "number",
      value: Math.floor(Math.random() * 1000),
      unit: "Wh/m2",
    },
    powerRatio: {
      type: "number",
      value: Math.floor(Math.random() * 100),
      unit: "%",
    },
    activePower: {
      type: "number",
      value: Math.floor(Math.random() * 1000),
      unit: "kW",
    },
    operatingState: {
      type: "string",
      value: "normal",
    },
  },
  {
    _id: 3,
    type: "Site",
    name: { type: "string", value: "Site 3" },
    operatingState: {
      type: "string",
      value: "underperformed",
    },
  },
  {
    _id: 4,
    type: "Site",
    name: { type: "string", value: "Site 4" },
    operatingState: {
      type: "string",
      value: "malfunctioned",
    },
  },
  {
    _id: 5,
    type: "Site",
    name: { type: "string", value: "Site 5" },
    operatingState: {
      type: "string",
      value: "connectionInterrupted",
    },
  },
  {
    _id: 6,
    type: "Site",
    name: { type: "string", value: "Site 6" },
  },
];
