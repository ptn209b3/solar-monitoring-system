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

function QueryList({ queryProps, icon, baseUrl }) {
  const { data } = queryProps;

  return (
    <Paper sx={{ border: "1px solid rgba(0, 0, 0, 0.12)" }} elevation={0}>
      <List>
        {data.map(({ name, deviceName, entityName, id }) => (
          <React.Fragment key={id}>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to={`${baseUrl}/${id}`}>
                {icon && (
                  <ListItemIcon>{React.createElement(icon)}</ListItemIcon>
                )}
                <ListItemText
                  primary={
                    name?.value || deviceName?.value || entityName?.value || id
                  }
                />
              </ListItemButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to={`${baseUrl}`}>
            <ListItemText primary="See all..." />
          </ListItemButton>
        </ListItem>
      </List>
    </Paper>
  );
}

export default QueryList;
