import { useEffect, useState } from "react";
import axios from "axios";

import Button from "@material-ui/core/Button";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";

export default function GatewayConfigModal(props) {
  const { open, setOpen, selectedGateway, gateways, setGateways } = props;

  const initialApikey = selectedGateway.apikey;
  const [apikey, setApikey] = useState(initialApikey);
  function handleChangeApikey(e) {
    setApikey(e.target.value);
  }
  const [interval, setInterval] = useState(1000);
  function handleChangeInterval(e) {
    setInterval(parseInt(e.target.value));
  }

  function handleClose() {
    setOpen(false);
  }
  function handleConfig() {
    axios
      .post(`/api/gateway/update/${selectedGateway._id}`, {
        ...(initialApikey !== apikey && { apikey }),
        ...(initialApikey !== apikey && { provision: "changed" }),
        interval,
      })
      .then(() => {
        let selectedIndex = gateways.indexOf(selectedGateway);
        setGateways([
          ...gateways.slice(0, selectedIndex),
          {
            ...selectedGateway,
            interval,
            ...(initialApikey !== apikey && { apikey }),
            ...(initialApikey !== apikey && { provision: "changed" }),
          },
          ...gateways.slice(selectedIndex + 1),
        ]);
        setOpen(false);
      })
      .catch((err) => {
        if (err.response) console.log(err.response.data);
        else console.log(err.message);
      });
  }

  useEffect(() => {
    setApikey(selectedGateway.apikey);
  }, [selectedGateway.apikey]);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Configure {selectedGateway.name}</DialogTitle>
      <DialogContent>
        <DialogContentText>Channels information</DialogContentText>
        <TextField
          type="text"
          fullWidth
          margin="dense"
          label="API Key"
          value={apikey}
          onChange={handleChangeApikey}
        />
        <TextField
          type="number"
          fullWidth
          margin="dense"
          label="Interval (milliseconds)"
          value={interval}
          onChange={handleChangeInterval}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfig} color="primary" variant="contained">
          Configure
        </Button>
        <Button onClick={handleClose} variant="contained">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
