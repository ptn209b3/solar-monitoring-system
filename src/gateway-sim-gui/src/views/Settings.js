import { useState } from "react";

import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

export default function Settings() {
  const classes = useStyles();

  const [state, setState] = useState({
    protocol: "MQTT",
  });

  function handleChange(e) {
    const target = e.target;
    const value = target.value;
    setState({
      ...state,
      [target.name]: value,
    });
  }

  return (
    <Paper className={classes.root}>
      <FormControl>
        <InputLabel id="protocol-label">Protocol</InputLabel>
        <Select
          labelId="protocol-label"
          id="protocol"
          value={state.protocol}
          onChange={handleChange}
          name="protocol"
        >
          <MenuItem value="MQTT">MQTT</MenuItem>
          <MenuItem value="HTTP">HTTP</MenuItem>
        </Select>
        <FormHelperText>Please choose "MQTT"</FormHelperText>
      </FormControl>
      <Button variant="contained" color="primary">
        Save
      </Button>
    </Paper>
  );
}
