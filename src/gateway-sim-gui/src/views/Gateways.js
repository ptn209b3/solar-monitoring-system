import GatewayAddModal from "../components/GatewayAddModal";
import GatewayConfigModal from "../components/GatewayConfigModal";
import GatewayRemoveModal from "../components/GatewayRemoveModal";
import GatewayItem from "../components/GatewayItem";

import { useState, useEffect } from "react";
import axios from "axios";

import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
}));

export default function Gateways() {
  const classes = useStyles();
  const [gateways, setGateways] = useState([]);
  const [selectedGateway, setSelectedGateway] = useState({});
  const [openAdd, setOpenAdd] = useState(false);
  const [openConfig, setOpenConfig] = useState(false);
  const [openRemove, setOpenRemove] = useState(false);

  useEffect(() => {
    axios
      .get("/api/gateway/get")
      .then((res) => {
        console.log("gateways:", res.data);
        setGateways(res.data);
      })
      .catch((err) => console.log(err.message));
  }, []);

  function handleClickConfig(gateway) {
    setSelectedGateway(gateway);
    setOpenConfig(true);
  }

  function handleClickRemove(gateway) {
    setSelectedGateway(gateway);
    setOpenRemove(true);
  }

  return (
    <Paper className={classes.root}>
      <Button variant="contained" onClick={() => setOpenAdd(true)}>
        Add Gateway
      </Button>

      <List>
        {gateways.map((gateway, index) => (
          <GatewayItem
            key={index}
            gateway={gateway}
            gateways={gateways}
            setGateways={setGateways}
            handleClickConfig={handleClickConfig}
            handleClickRemove={handleClickRemove}
            index={index}
          />
        ))}
      </List>

      <GatewayAddModal
        open={openAdd}
        setOpen={setOpenAdd}
        gateways={gateways}
        setGateways={setGateways}
      />
      <GatewayConfigModal
        open={openConfig}
        setOpen={setOpenConfig}
        selectedGateway={selectedGateway}
        gateways={gateways}
        setGateways={setGateways}
      />
      <GatewayRemoveModal
        open={openRemove}
        setOpen={setOpenRemove}
        selectedGateway={selectedGateway}
        gateways={gateways}
        setGateways={setGateways}
      />
    </Paper>
  );
}
