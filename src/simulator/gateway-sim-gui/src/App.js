import Settings from "./views/Settings";
import Status from "./views/Status";
import Gateways from "./views/Gateways";
import Devices from "./views/Devices";
import Channels from "./views/Channels";
import ChannelInfo from "./views/ChannelInfo";

import { Switch, Route, Link, Redirect } from "react-router-dom";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import BugReportIcon from "@material-ui/icons/BugReport";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  App: {
    minHeight: "100vh",
    backgroundColor: "#1d3557",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  Window: {
    width: 800,
    height: 600,
    border: "1px solid black",
    backgroundColor: "white",

    display: "flex",
  },
  Nav: {
    width: 200,
  },
  Main: {
    flexGrow: 1,
    backgroundColor: "#a8dadc",

    display: "flex",
  },
}));

function App() {
  const classes = useStyles();
  return (
    <div className={classes.App}>
      <div className={classes.Window}>
        <div className={classes.Nav}>
          <List>
            <ListItem button component={Link} to="/status">
              <ListItemIcon>
                <BugReportIcon />
              </ListItemIcon>
              <ListItemText primary="Status" />
            </ListItem>
            <ListItem button component={Link} to="/settings">
              <ListItemIcon>
                <BugReportIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>

            <ListItem button component={Link} to="/gateways">
              <ListItemIcon>
                <BugReportIcon />
              </ListItemIcon>
              <ListItemText primary="Gateways" />
            </ListItem>
          </List>
        </div>
        <div className={classes.Main}>
          <Switch>
            <Route exact path="/">
              <Redirect to="/status" />
            </Route>
            <Route path="/status">
              <Status />
            </Route>
            <Route path="/settings">
              <Settings />
            </Route>

            <Route path="/gateways">
              <Gateways />
            </Route>
            <Route path="/devices/:gatewayId">
              <Devices />
            </Route>
            <Route path="/channels/:deviceId">
              <Channels />
            </Route>
            <Route path="/channel/:channelId">
              <ChannelInfo />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
}

export default App;
