import React from "react";

import {
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Typography,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { ColorModeButton } from "../features/theme";
import { useLogoutAuth } from "../features/api";

const drawerWidth = 240;

function Header({ handleDrawerToggle }) {
  console.log("Header rerenders");

  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    // handleMobileMenuClose();
  };

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const logoutAuth = useLogoutAuth();
  function handleClickLogout() {
    logoutAuth.mutate();
  }
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleClickLogout}>Log out</MenuItem>
    </Menu>
  );

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleClickLogout}>
        <IconButton size="large" color="inherit">
          <AccountCircleIcon />
        </IconButton>
        <span>Logout</span>
      </MenuItem>
      <MenuItem>
        <ColorModeButton />
        <span>Mode</span>
      </MenuItem>
    </Menu>
  );

  return (
    <AppBar
      elevation={0}
      position="fixed"
      sx={{
        width: { lg: `calc(100% - ${drawerWidth}px)` },
        ml: { lg: `${drawerWidth}px` },
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { lg: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" noWrap component="div">
          Monitoring Frontend
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: { xs: "none", lg: "flex" } }}>
          <ColorModeButton />
        </Box>
        <Box sx={{ display: { xs: "none", lg: "flex" } }}>
          <IconButton
            size="large"
            edge="end"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <AccountCircleIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: { xs: "flex", lg: "none" } }}>
          <IconButton
            size="large"
            onClick={handleMobileMenuOpen}
            color="inherit"
          >
            <MoreVertIcon />
          </IconButton>
        </Box>
      </Toolbar>

      {/* should be under appbar, fix in future */}
      {renderMobileMenu}
      {renderMenu}
    </AppBar>
  );
}

export default React.memo(Header);
