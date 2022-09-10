import { useState } from "react";
import axios from "axios";

import Button from "@material-ui/core/Button";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";

export default function GatewayAddModal({
  open,
  setOpen,
  gateways,
  setGateways,
}) {
  const [name, setName] = useState("");
  function handleChangeName(e) {
    setName(e.target.value);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleAdd() {
    axios
      .post("/api/gateway/add", {
        name,
      })
      .then((res) => {
        setGateways([...gateways, res.data]);
        setOpen(false);
      })
      .catch((err) => {
        if (err.response) console.log(err.response.data);
        else console.log(err.message);
      });
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Add new gateway</DialogTitle>
      <DialogContent>
        <DialogContentText>Enter gateway name</DialogContentText>
        <TextField
          autoFocus
          type="text"
          fullWidth
          margin="dense"
          label="Gateway Name"
          value={name}
          onChange={handleChangeName}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAdd} color="primary" variant="contained">
          Add
        </Button>
        <Button onClick={handleClose} variant="contained">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
