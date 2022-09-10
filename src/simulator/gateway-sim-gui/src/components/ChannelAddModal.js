import { useState } from "react";

import Button from "@material-ui/core/Button";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
// import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
}));

function ChannelAddModal(props) {
  let { setOpen, open, handleAdd } = props;
  const classes = useStyles();
  const [info, setInfo] = useState({
    channel_id: "",
    channel_name: "",
  });
  const [configs, setConfigs] = useState({
    type: "number",
    kind: "triangle",
    min: 0,
    max: 100,
    start: 0,
    step: 1,
  });
  function handleChangeConfigs(e) {
    var value = e.target.value;

    if (e.target.name === "max") {
      value = parseInt(value);
      if (value < configs.min) value = configs.min;
    }

    if (e.target.name === "min") {
      value = parseInt(value);
      if (value > configs.max) value = configs.max;
    }

    if (e.target.name === "step") {
      value =
        configs.kind === "triangle"
          ? parseFloat(Math.abs(value))
          : parseFloat(value);
    }

    if (e.target.name === "start") value = parseFloat(value);

    setConfigs({
      ...configs,
      [e.target.name]: value,
    });
  }

  function handleChangeInfo(e) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setInfo({
      ...info,
      [target.name]: value,
    });
  }

  function handleClose() {
    setOpen(false);
  }

  function handleClickAdd() {
    handleAdd(info, configs);
    setOpen(false);
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Add new channel</DialogTitle>
      <DialogContent>
        <DialogContentText>Enter channel information</DialogContentText>
        <TextField
          autoFocus
          type="text"
          margin="dense"
          label="Channel Id"
          name="channel_id"
          value={info.channel_id}
          onChange={handleChangeInfo}
        />
        <TextField
          type="text"
          margin="dense"
          label="Channel Name"
          name="channel_name"
          value={info.channel_name}
          onChange={handleChangeInfo}
        />

        <FormControl className={classes.formControl}>
          <InputLabel id="type">Type</InputLabel>
          <Select
            labelId="type"
            name="type"
            value={configs.type}
            onChange={handleChangeConfigs}
          >
            <MenuItem value="number">Number</MenuItem>
            <MenuItem value="string" disabled>
              String
            </MenuItem>
            <MenuItem value="boolean" disabled>
              Boolean
            </MenuItem>
          </Select>
        </FormControl>

        {configs.type === "number" ? (
          <FormControl className={classes.formControl}>
            <InputLabel id="kind">Kind</InputLabel>
            <Select
              labelId="kind"
              name="kind"
              value={configs.kind}
              onChange={handleChangeConfigs}
            >
              <MenuItem value="sine" disabled>
                Sine
              </MenuItem>
              <MenuItem value="square" disabled>
                Square
              </MenuItem>
              <MenuItem value="triangle">Triangle</MenuItem>
              <MenuItem value="sawtooth" disabled>
                Sawtooth
              </MenuItem>
              <MenuItem value="ramp">Ramp</MenuItem>
              <MenuItem value="random">Random</MenuItem>
            </Select>
          </FormControl>
        ) : null}

        {configs.kind === "triangle" ? (
          <>
            <TextField
              type="number"
              margin="dense"
              label="Min"
              name="min"
              value={configs.min}
              onChange={handleChangeConfigs}
            />
            <TextField
              type="number"
              margin="dense"
              label="Max"
              name="max"
              value={configs.max}
              onChange={handleChangeConfigs}
            />
            <TextField
              type="number"
              margin="dense"
              label="Step"
              name="step"
              value={configs.step}
              onChange={handleChangeConfigs}
            />
          </>
        ) : null}

        {configs.kind === "ramp" ? (
          <>
            <TextField
              type="number"
              margin="dense"
              label="Start"
              name="start"
              value={configs.start}
              onChange={handleChangeConfigs}
            />
            <TextField
              type="number"
              margin="dense"
              label="Step"
              name="step"
              value={configs.step}
              onChange={handleChangeConfigs}
            />
          </>
        ) : null}

        {configs.kind === "random" ? (
          <>
            <TextField
              type="number"
              margin="dense"
              label="Min"
              name="min"
              value={configs.min}
              onChange={handleChangeConfigs}
            />
            <TextField
              type="number"
              margin="dense"
              label="Max"
              name="max"
              value={configs.max}
              onChange={handleChangeConfigs}
            />
          </>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClickAdd} color="primary" variant="contained">
          Add
        </Button>
        <Button onClick={handleClose} variant="contained">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ChannelAddModal;
