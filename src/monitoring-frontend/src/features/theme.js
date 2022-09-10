import React from "react";

import {
  createTheme,
  ThemeProvider as MuiThemProvider,
  useTheme,
} from "@mui/material/styles";

import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import useMediaQuery from "@mui/material/useMediaQuery";

import { CssBaseline, IconButton } from "@mui/material";

function optionsFromMode(mode) {
  return {
    breakpoints: {
      values: {
        xs: 0,
        sm: 576,
        md: 768,
        lg: 992,
        xl: 1200,
      },
    },
    palette: {
      mode,
      ...(mode === "light"
        ? {
            // palette values for light mode
          }
        : {
            // palette values for dark mode
          }),
    },
  };
}

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

export function ThemeProvider({ children }) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = React.useState("light");

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
      colorMode: mode,
      mode: mode,
    }),
    [mode]
  );

  const theme = React.useMemo(() => createTheme(optionsFromMode(mode)), [mode]);

  React.useEffect(() => {
    setMode(prefersDarkMode ? "dark" : "light");
  }, [prefersDarkMode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MuiThemProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemProvider>
    </ColorModeContext.Provider>
  );
}

export function ColorModeButton() {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);

  return (
    <IconButton color="inherit" onClick={colorMode.toggleColorMode}>
      {theme.palette.mode === "dark" ? <DarkModeIcon /> : <LightModeIcon />}
    </IconButton>
  );
}
