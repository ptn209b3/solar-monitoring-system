import React from "react";

import { TextField, MenuItem } from "@mui/material";

export default function CustomSelect(props) {
  const { options, value, onChange, ...selectProps } = props;
  return (
    <TextField
      label="Select"
      select
      value={value}
      onChange={onChange}
      {...selectProps}
    >
      {options.map(({ label, value }, index) => (
        <MenuItem key={value} value={value}>
          {label}
        </MenuItem>
      ))}
    </TextField>
  );
}
