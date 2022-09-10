import axios from "axios";
import Button from "@material-ui/core/Button";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

function GatewayRemoveModal(props) {
  const { open, setOpen, selectedGateway, gateways, setGateways } = props;

  function handleClose() {
    setOpen(false);
  }
  function handleRemove() {
    axios
      .get(`/api/gateway/delete/${selectedGateway._id}`)
      .then(() =>
        setGateways(
          gateways.filter((gateway) => gateway._id !== selectedGateway._id)
        )
      )
      .catch((err) => {
        if (err.response) console.log(err.response.data);
        else console.log(err.message);
      });
    setOpen(false);
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Remove {selectedGateway.name}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Configured devices and channels will also be deleted.
        </DialogContentText>
        <DialogContentText>This cannot be undone.</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained">
          Cancel
        </Button>
        <Button onClick={handleRemove} color="primary" variant="contained">
          Remove
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default GatewayRemoveModal;
