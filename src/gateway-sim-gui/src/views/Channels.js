import ChannelAddModal from "../components/ChannelAddModal";
import ChannelRemoveModal from "../components/ChannelRemoveModal";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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

export default function Channels() {
  const { deviceId } = useParams();
  const classes = useStyles();
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState({});
  const [openAdd, setOpenAdd] = useState(false);
  const [openRemove, setOpenRemove] = useState(false);

  function handleAdd(info, configs) {
    const newChannel = { device: deviceId, ...info, configs };
    axios
      .post("/api/channel/add", newChannel)
      .then((res) => setChannels([...channels, res.data]))
      .catch((err) => console.log(err.message));
  }

  function handleClickRemove(channel) {
    setSelectedChannel(channel);
    setOpenRemove(true);
  }
  function handleRemove() {
    axios
      .get(`/api/channel/delete/${selectedChannel._id}`)
      .then(() =>
        setChannels(
          channels.filter((channel) => channel._id !== selectedChannel._id)
        )
      )
      .catch((err) => console.log(err.message));
  }

  useEffect(() => {
    axios
      .get("/api/channel/get", {
        params: {
          device: deviceId,
        },
      })
      .then((res) => {
        console.log("channels:", res.data);
        setChannels(res.data);
      })
      .catch((err) => console.log(err.message));
  }, [deviceId]);

  return (
    <Paper className={classes.root}>
      <Button variant="contained" onClick={() => setOpenAdd(true)}>
        Add Channel
      </Button>

      <List>
        {channels.map((channel, index) => (
          <ListItem
            key={index}
            // button
            // onClick={() => history.push(`/channel/${channel._id}`)}
          >
            <ListItemText
              primary={`Name: ${channel.channel_name}. ID: ${channel.channel_id}`}
              secondary={`Type: ${channel.configs.type}. Kind: ${channel.configs.kind}`}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => handleClickRemove(channel)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <ChannelAddModal
        open={openAdd}
        setOpen={setOpenAdd}
        handleAdd={handleAdd}
      />
      <ChannelRemoveModal
        open={openRemove}
        setOpen={setOpenRemove}
        channel={selectedChannel}
        handleRemove={handleRemove}
      />
    </Paper>
  );
}
