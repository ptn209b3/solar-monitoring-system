import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import "./index.css";
import App from "./App";

import { ThemeProvider } from "./features/theme";

import { QueryClient, QueryClientProvider } from "react-query";
import { io } from "socket.io-client";
import { IoTClient, IoTClientProvider } from "./lib/iot-lib";

const host = "http://localhost:5000";
const socket = io(host);
const ioTClient = new IoTClient(socket);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter basename="/app">
      <QueryClientProvider client={queryClient}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ThemeProvider>
            <IoTClientProvider client={ioTClient}>
              <CssBaseline />
              <App />
            </IoTClientProvider>
          </ThemeProvider>
        </LocalizationProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
