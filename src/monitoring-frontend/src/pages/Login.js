import React from "react";

import { Box, Typography, TextField, Paper, Stack } from "@mui/material";
import loginBackground from "../images/login.jpg";
import { useLoginAuth } from "../features/api";
import { ProgressButton } from "../components";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const navigate = useNavigate();

  const loginAuth = useLoginAuth({
    onSuccess() {
      navigate("/");
    },
  });

  function handleClickLogin() {
    loginAuth.mutate({ username: username, password: password });
  }

  return (
    <Box
      flex={1}
      height={1}
      bgcolor="background.default"
      overflow="auto"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ background: `url(${loginBackground}) center` }}
    >
      <Paper elevation={6}>
        <Stack spacing={2} padding={2} height={420} width={320}>
          <Typography variant="h5">Log in form</Typography>
          <Typography>Using your provided credentials to login</Typography>
          <Box>
            <Typography variant="h6">Username</Typography>
            <TextField
              required
              size="small"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Box>

          <Box>
            <Typography variant="h6">Password</Typography>
            <TextField
              required
              size="small"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Box>

          <ProgressButton requestProps={loginAuth} onClick={handleClickLogin}>
            Login
          </ProgressButton>

          {loginAuth.isError && (
            <Typography>Wrong user name or password</Typography>
          )}

          <Typography>Having problems with your credential?</Typography>
          <Typography>Contact tai.le2712@gmail.com</Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
