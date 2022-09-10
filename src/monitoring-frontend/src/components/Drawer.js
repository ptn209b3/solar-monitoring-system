import React from "react";
import {
  Box,
  Toolbar,
  Divider,
  Drawer as MuiDrawer,
  Stack,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
// import logo from "../images/tekjoy.jpg";

import { List, ListItemButton, ListItemText, Collapse } from "@mui/material";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import { useGetAuth } from "../features/api";

const drawerWidth = 240;

function AllLinks() {
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };
  const { data: auth } = useGetAuth();
  const isAdmin = auth?.role === "admin" ? true : false;

  return (
    <List sx={{ bgcolor: "background.paper" }}>
      <ListItemButton onClick={handleClick}>
        <ListItemText primary="Central Monitor" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto">
        <List component="div" disablePadding>
          <ListItemLink
            to="/central-monitor/fleetview"
            primary={"FleetView"}
            sx={{ pl: 4 }}
          />
          <ListItemLink
            to="/central-monitor/site-list"
            primary={"Site List"}
            sx={{ pl: 4 }}
          />
        </List>
      </Collapse>

      <ListItemButton onClick={handleClick}>
        <ListItemText primary="Site Monitor" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto">
        <List component="div" disablePadding>
          <ListItemLink
            to="/site-monitor/site-view"
            primary={"Site View"}
            sx={{ pl: 4 }}
          />
        </List>
      </Collapse>

      <ListItemButton onClick={handleClick}>
        <ListItemText primary="Managements" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto">
        <List component="div" disablePadding>
          <ListItemLink
            to="/managements/sites"
            primary={"Sites"}
            sx={{ pl: 4 }}
          />
          {isAdmin && (
            <ListItemLink
              to="/managements/users"
              primary={"Users"}
              sx={{ pl: 4 }}
            />
          )}
        </List>
      </Collapse>

      {/* <ListItemButton onClick={handleClick}>
        <ListItemText primary="Reports" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto">
        <List component="div" disablePadding>
          <ListItemLink
            to="/reports/site-report"
            primary={"Site Report"}
            sx={{ pl: 4 }}
          />
          <ListItemLink
            to="/reports/device-report"
            primary={"Device Report"}
            sx={{ pl: 4 }}
          />
        </List>
      </Collapse> */}

      <ListItemLink to="/home" primary={"Home"} />
      {/* <ListItemLink to="/test" primary={"Test"} /> */}
    </List>
  );
}

function ListItemLink({ sx, primary, to }) {
  return (
    <ListItemButton sx={sx} component={RouterLink} to={to}>
      <ListItemText primary={primary} />
    </ListItemButton>
  );
}

export default function Drawer({ mobileOpen, handleDrawerToggle }) {
  const { data: auth } = useGetAuth();

  const drawer = (
    <Stack height={1} overflow="auto">
      <Toolbar>
        {/* <img src={logo} alt="logo" style={{ width: "100%" }} /> */}
        {(auth?.role === "admin" && "admin") || auth.username}
      </Toolbar>
      <Divider />
      <Box flex="1" overflow="auto">
        <AllLinks />
      </Box>
    </Stack>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}
    >
      <MuiDrawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </MuiDrawer>

      <MuiDrawer
        variant="permanent"
        sx={{
          display: { xs: "none", lg: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
        open
      >
        {drawer}
      </MuiDrawer>
    </Box>
  );
}
