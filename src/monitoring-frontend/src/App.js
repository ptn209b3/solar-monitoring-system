import React from "react";

import { Box } from "@mui/material";

import { Header, Drawer, Main } from "./components";
import { useGetAuth } from "./features/api";
import Login from "./pages/Login";
import LoginCheck from "./pages/LoginCheck";

function App() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = React.useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const { isLoading, isError } = useGetAuth();

  if (isLoading)
    return (
      <Box display="flex" height="100vh" overflow="auto">
        <LoginCheck />
      </Box>
    );
  if (isError) {
    return (
      <Box display="flex" height="100vh" overflow="auto">
        <Login />
      </Box>
    );
  }

  return (
    <Box display="flex" height="100vh" overflow="auto">
      <Header handleDrawerToggle={handleDrawerToggle} />
      <Drawer mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
      <Main />
    </Box>
  );
}

export default App;
