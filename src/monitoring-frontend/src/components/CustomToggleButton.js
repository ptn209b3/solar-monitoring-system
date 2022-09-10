import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export default function CustomToggleButton({ options, value, setValue }) {
  function handleChange(e, newState) {
    setValue(newState);
  }
  return (
    <ToggleButtonGroup value={value} exclusive onChange={handleChange}>
      {options.map(({ value, Icon, label }) => (
        <ToggleButton value={value} key={value}>
          {(Icon && <Icon />) || label || value}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
