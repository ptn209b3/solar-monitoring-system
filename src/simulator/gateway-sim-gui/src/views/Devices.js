import DeviceAddModal from "../components/DeviceAddModal";
import DeviceRemoveModal from "../components/DeviceRemoveModal";

import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";

import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Paper from "@material-ui/core/Paper";

import DeleteIcon from "@material-ui/icons/Delete";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
}));

export default function Devices() {
  const { gatewayId } = useParams();
  const classes = useStyles();
  const history = useHistory();
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState({});
  const [openAdd, setOpenAdd] = useState(false);
  const [openRemove, setOpenRemove] = useState(false);

  function handleAdd(device) {
    axios
      .post("/api/device/add", { ...device, gateway: gatewayId })
      .then((res) => setDevices([...devices, res.data]))
      .catch((error) =>
        error.response
          ? console.log(error.response.data)
          : console.log(error.message)
      );
  }

  function handleClickRemove(device) {
    setSelectedDevice(device);
    setOpenRemove(true);
  }
  function handleRemove() {
    axios
      .get(`/api/device/delete/${selectedDevice._id}`)
      .then(() =>
        setDevices(
          devices.filter((device) => device._id !== selectedDevice._id)
        )
      )
      .catch((error) => console.log(error.message));
  }

  useEffect(() => {
    axios
      .get("/api/device/get", {
        params: {
          gateway: gatewayId,
        },
      })
      .then((res) => {
        console.log("devices:", res.data);
        setDevices(res.data);
      })
      .catch((error) => console.log(error.message));
  }, [gatewayId]);

  return (
    <Paper className={classes.root}>
      <Button variant="contained" onClick={() => setOpenAdd(true)}>
        Add Device
      </Button>

      <List>
        {devices.map((device, index) => (
          <ListItem
            button
            key={index}
            onClick={() => history.push(`/channels/${device._id}`)}
          >
            <ListItemText
              primary={`Name: ${device.device_name}. ID: ${device.device_id}`}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                title="Remove this device"
                onClick={() => handleClickRemove(device)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <DeviceAddModal
        open={openAdd}
        setOpen={setOpenAdd}
        handleAdd={handleAdd}
      />
      <DeviceRemoveModal
        open={openRemove}
        setOpen={setOpenRemove}
        device={selectedDevice}
        handleRemove={handleRemove}
      />
    </Paper>
  );
}
