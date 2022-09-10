import Button from "@material-ui/core/Button";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

function ChannelRemoveModal(props) {
  const { open, setOpen, channel, handleRemove } = props;

  function handleClose() {
    setOpen(false);
  }
  function handleClickRemove() {
    handleRemove();
    setOpen(false);
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Remove {channel.channel_name}</DialogTitle>
      <DialogContent>
        <DialogContentText>This channel will be deleted.</DialogContentText>
        <DialogContentText>This cannot be undone.</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained">
          Cancel
        </Button>
        <Button onClick={handleClickRemove} color="primary" variant="contained">
          Remove
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ChannelRemoveModal;
