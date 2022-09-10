import React from "react";

import { useNavigate } from "react-router-dom";

import {
  Divider,
  TextField,
  Typography,
  Stack,
  Box,
  Container,
} from "@mui/material";

import ProgressButton from "../../components/ProgressButton";
import { useAddUser } from "../../features/api";

export default function UserNew() {
  const navigate = useNavigate();

  const [email, setEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rePass, setRePass] = React.useState("");

  const userAddition = useAddUser({
    onSuccess() {
      navigate("..");
    },
  });

  const canAdd =
    [email, username, password, rePass].every(Boolean) &&
    rePass === password &&
    !userAddition.isLoading;

  const handleAddUser = async () => {
    if (canAdd) {
      try {
        const newUser = {
          username,
          password,
          email,
          role: "user",
        };

        userAddition.mutate(newUser);
      } catch (err) {
        console.error("Failed to add user:", err);
      }
    }
  };

  return (
    <Box height={1} bgcolor="background.default" overflow="auto">
      <Container fixed>
        <Stack spacing={1}>
          <Typography variant="h4">Add new user</Typography>
          <Divider />
          <Stack spacing={1}>
            <Box>
              <Typography variant="h6">Email</Typography>
              <TextField
                required
                size="small"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Box>

            <Box>
              <Typography variant="h6">Username</Typography>
              <TextField
                required
                size="small"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Box>

            <Box>
              <Typography variant="h6">Re-enter password</Typography>
              <TextField
                required
                size="small"
                type="password"
                value={rePass}
                onChange={(e) => setRePass(e.target.value)}
              />
            </Box>
          </Stack>

          <Divider />

          <Box>
            <ProgressButton
              onClick={handleAddUser}
              disabled={!canAdd}
              variant="contained"
              requestProps={userAddition}
            >
              Add user
            </ProgressButton>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
