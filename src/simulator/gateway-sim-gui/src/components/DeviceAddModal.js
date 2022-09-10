import { useState } from "react";

import Button from "@material-ui/core/Button";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";

const initialState = {
  device_id: "",
  device_name: "",
};
function DeviceAddModal(props) {
  let { setOpen, open, handleAdd } = props;

  const [state, setState] = useState(initialState);

  function handleChange(e) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setState({
      ...state,
      [target.name]: value,
    });
  }

  function handleClose() {
    setOpen(false);
  }

  function handleClickAdd() {
    handleAdd(state);
    setOpen(false);
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Add new device</DialogTitle>
      <DialogContent>
        <DialogContentText>Enter device information</DialogContentText>
        <TextField
          autoFocus
          type="text"
          fullWidth
          margin="dense"
          label="Device Id"
          name="device_id"
          value={state.device_id}
          onChange={handleChange}
        />
        <TextField
          type="text"
          fullWidth
          margin="dense"
          label="Device Name"
          name="device_name"
          value={state.device_name}
          onChange={handleChange}
        />
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

export default DeviceAddModal;
