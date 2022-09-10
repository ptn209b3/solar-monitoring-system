import React from "react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { TextField } from "@mui/material";

const views = ["year", "month", "day", "hours", "minutes", "seconds"];

export default function CustomDateTimePicker(props) {
  const { value, setValue, unit, ...other } = props;

  let level = React.useMemo(
    () => views.slice(0, views.indexOf(unit) + 1),
    [unit]
  );

  return (
    <DateTimePicker
      renderInput={(params) => <TextField {...params} size="small" />}
      value={value}
      onChange={setValue}
      ampm={false}
      views={level}
      {...other}
    />
  );
}
