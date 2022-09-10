import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";

const views = ["year", "month", "day"];

export default function CustomDatePicker(props) {
  const { value, setValue, unit, ...other } = props;

  let level = React.useMemo(
    () => views.slice(0, views.indexOf(unit) + 1),
    [unit]
  );

  return (
    <DatePicker
      renderInput={(params) => <TextField {...params} size="small" />}
      value={value}
      onChange={setValue}
      views={level}
      {...other}
    />
  );
}
