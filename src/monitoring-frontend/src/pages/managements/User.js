import React from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  Stack,
  // Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import { useParams, useNavigate } from "react-router-dom";
import { useDeleteUser } from "../../features/api";

export default function User() {
  const { userId } = useParams();

  const navigate = useNavigate();
  const [deleteUserOpen, setDeleteUserOpen] = React.useState(false);
  const userDeletion = useDeleteUser({
    onSuccess() {
      navigate("./..");
    },
  });

  function handleClickDeleteUser() {
    setDeleteUserOpen(true);
  }
  function handleCancelDeleteUser() {
    setDeleteUserOpen(false);
  }
  function handleConfirmDeleteUser() {
    userDeletion.mutate(userId);
  }

  return (
    <Box height={1} flex={1} overflow="auto">
      <Container fixed>
        <Typography variant="h4">Danger Zone</Typography>

        <Box
          sx={{
            border: "1px solid rgba(0, 0, 0, 0.12)",
            borderRadius: 1,
            padding: 1,
          }}
        >
          <Typography variant="h6">Delete this device</Typography>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent={{ md: "space-between" }}
            spacing={1}
          >
            <Typography>
              Once you delete a user, there is no going back. Please be certain.
            </Typography>
            <Button
              sx={{ whiteSpace: "nowrap", minWidth: "max-content" }}
              color="error"
              variant="outlined"
              onClick={handleClickDeleteUser}
            >
              Delete this user
            </Button>
          </Stack>
          {/* <Divider sx={{ mt: 1 }} /> */}
        </Box>

        <Dialog open={deleteUserOpen} onClose={handleCancelDeleteUser}>
          <DialogTitle>Delete user confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure to continue?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDeleteUser}>Cancel</Button>
            <Button onClick={handleConfirmDeleteUser} autoFocus color="error">
              Delete this user
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
