import { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DeleteIcon from "@material-ui/icons/Delete";
import SettingsIcon from "@material-ui/icons/Settings";
import CallMadeIcon from "@material-ui/icons/CallMade";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import green from "@material-ui/core/colors/green";
import red from "@material-ui/core/colors/red";
import grey from "@material-ui/core/colors/grey";

export default function GatewayItem(props) {
  const history = useHistory();
  const {
    gateway,
    handleClickConfig,
    handleClickRemove,
    gateways,
    setGateways,
    index,
  } = props;

  const [startWaiting, setStartWaiting] = useState(false);
  const [stopWaiting, setStopWaiting] = useState(false);
  const [provisionWaiting, setProvisionWaiting] = useState(false);

  function handleStart() {
    setStartWaiting(true);
    axios
      .get(`/api/gateway/start/${gateway._id}`)
      .then(() =>
        setGateways([
          ...gateways.slice(0, index),
          { ...gateway, running: true },
          ...gateways.slice(index + 1),
        ])
      )
      .catch((err) => {
        if (err.response) console.log(err.response.data);
      })
      .finally(() => setStartWaiting(false));
  }
  function handleStop() {
    setStopWaiting(true);
    axios
      .get(`/api/gateway/stop/${gateway._id}`)
      .then(() =>
        setGateways([
          ...gateways.slice(0, index),
          { ...gateway, running: false },
          ...gateways.slice(index + 1),
        ])
      )
      .catch((err) => {
        if (err.response) console.log(err.response.data);
      })
      .finally(() => setStopWaiting(false));
  }
  function handleProvision() {
    setProvisionWaiting(true);
    axios
      .get(`/api/gateway/provision/${gateway._id}`)
      .then(() =>
        setGateways([
          ...gateways.slice(0, index),
          { ...gateway, provision: "done" },
          ...gateways.slice(index + 1),
        ])
      )
      .catch((err) => {
        if (err.response) console.log(err.response.data);
      })
      .finally(() => setProvisionWaiting(false));
  }

  function handleconfig() {
    handleClickConfig(gateway);
  }

  function handleRemove() {
    handleClickRemove(gateway);
  }

  return (
    <ListItem button onClick={() => history.push(`/devices/${gateway._id}`)}>
      <ListItemText
        primary={gateway.name}
        secondary={
          "Provision: " +
          gateway.provision +
          ", " +
          "API Key: " +
          (gateway.apikey || "unset") +
          ", " +
          "Interval: " +
          gateway.interval +
          " ms."
        }
      />
      <ListItemSecondaryAction>
        {gateway.running ? (
          <IconButton
            title="Stop sending telemetry"
            onClick={handleStop}
            disabled={stopWaiting}
          >
            <PauseIcon
              style={{ color: stopWaiting ? grey[500] : green[500] }}
            />
          </IconButton>
        ) : (
          <IconButton
            title="Start sending telemetry"
            onClick={handleStart}
            disabled={startWaiting}
          >
            <PlayArrowIcon
              style={{ color: startWaiting ? grey[500] : red[500] }}
            />
          </IconButton>
        )}

        <IconButton
          title="Send provision"
          onClick={handleProvision}
          disabled={provisionWaiting}
        >
          <CallMadeIcon
            style={{
              color: provisionWaiting
                ? grey[500]
                : gateway.provision === "done"
                ? green[500]
                : red[500],
            }}
          />
        </IconButton>

        <IconButton
          name="hello"
          onClick={handleconfig}
          title="Configure API key"
        >
          <SettingsIcon />
        </IconButton>

        <IconButton
          edge="end"
          title="Remove this gateway"
          onClick={handleRemove}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}
