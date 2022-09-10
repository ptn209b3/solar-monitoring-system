import React from "react";
import {
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

function CustomList({ items = [] }) {
  return (
    <Paper sx={{ border: "1px solid rgba(0, 0, 0, 0.12)" }} elevation={0}>
      <List>
        {items.map(({ id, to, primary, icon }, index) => (
          <React.Fragment key={id}>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to={to}>
                {icon && (
                  <ListItemIcon>{React.createElement(icon)}</ListItemIcon>
                )}
                <ListItemText primary={primary} />
              </ListItemButton>
            </ListItem>
            {index !== items.length - 1 ? <Divider /> : null}
          </React.Fragment>
        ))}
        {!items.length && (
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary={"No item"} />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Paper>
  );
}

export default CustomList;
