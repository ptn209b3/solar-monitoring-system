import React from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  Stack,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import { useDeleteEntity, useDeleteRecord } from "../../features/api";
import { useParams, useNavigate } from "react-router-dom";

export default function DeviceSettings() {
  const navigate = useNavigate();
  const { deviceId, inverterId, powerMeterId, weatherStationId } = useParams();
  const [deleteDeviceOpen, setDeleteDeviceOpen] = React.useState(false);
  const entityId = deviceId || inverterId || powerMeterId || weatherStationId;
  const deviceMutation = useDeleteEntity({
    onSuccess() {
      navigate("./../..");
    },
  });
  const recordMutation = useDeleteRecord({
    onSuccess() {
      setDeleteRecordsOpen(false);
    },
  });

  function handleClickDeleteDevice() {
    setDeleteDeviceOpen(true);
  }
  function handleCancelDeleteDevice() {
    setDeleteDeviceOpen(false);
  }
  function handleConfirmDeleteDevice() {
    deviceMutation.mutate(entityId);
  }

  const [deleteRecordsOpen, setDeleteRecordsOpen] = React.useState(false);
  function handleClickDeleteRecords() {
    setDeleteRecordsOpen(true);
  }
  function handleCancelDeleteRecords() {
    setDeleteRecordsOpen(false);
  }
  function handleConfirmDeleteRecords() {
    recordMutation.mutate(entityId);
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
              Once you delete a device, there is no going back. Please be
              certain.
            </Typography>
            <Button
              sx={{ whiteSpace: "nowrap", minWidth: "max-content" }}
              color="error"
              variant="outlined"
              onClick={handleClickDeleteDevice}
            >
              Delete this device
            </Button>
          </Stack>
          <Divider sx={{ mt: 1 }} />
          <Typography variant="h6">Delete records</Typography>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent={{ md: "space-between" }}
            spacing={1}
          >
            <Typography>
              Once you delete this device's records, there is no going back.
              Please be certain.
            </Typography>
            <Button
              sx={{ whiteSpace: "nowrap", minWidth: "max-content" }}
              color="error"
              variant="outlined"
              onClick={handleClickDeleteRecords}
            >
              Delete records
            </Button>
          </Stack>
        </Box>

        <Dialog open={deleteDeviceOpen} onClose={handleCancelDeleteDevice}>
          <DialogTitle>Delete device confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure to continue?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDeleteDevice}>Cancel</Button>
            <Button onClick={handleConfirmDeleteDevice} autoFocus color="error">
              Delete this device
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={deleteRecordsOpen} onClose={handleCancelDeleteRecords}>
          <DialogTitle>Delete records confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure to continue?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDeleteRecords}>Cancel</Button>
            <Button
              onClick={handleConfirmDeleteRecords}
              autoFocus
              color="error"
            >
              Delete records
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
