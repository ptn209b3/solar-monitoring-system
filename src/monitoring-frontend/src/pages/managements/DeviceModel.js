import React from "react";
import {
  Box,
  Container,
  Stack,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

import { PageTitle } from "../../components";
import { useGetEntityById, useDeleteEntity } from "../../features/api";

export default function DeviceModel() {
  const { deviceModelId } = useParams();
  const { data: deviceModel } = useGetEntityById([deviceModelId], {
    initialData: null,
  });
  const fields = deviceModel?.fields?.value || [];

  const navigate = useNavigate();
  const [deleteDeviceModelOpen, setDeleteDeviceModelOpen] =
    React.useState(false);
  const deviceModelMutation = useDeleteEntity({
    onSuccess() {
      navigate("./..");
    },
  });

  function handleClickDeleteDeviceModel() {
    setDeleteDeviceModelOpen(true);
  }
  function handleCancelDeleteDeviceModel() {
    setDeleteDeviceModelOpen(false);
  }
  function handleConfirmDeleteDeviceModel() {
    deviceModelMutation.mutate(deviceModelId);
  }

  return (
    <Box sx={{ height: 1, bgcolor: "background.default", overflow: "auto" }}>
      <Container maxWidth="xs">
        <Stack spacing={1}>
          <PageTitle>Device Model Detail</PageTitle>

          <Typography variant="h4">Device Model Details</Typography>

          <Container maxWidth="sm">
            <Stack spacing={1}>
              {fields.map((field, i) => (
                <Stack direction="row" sx={{ gap: 1 }} key={i}>
                  <TextField
                    size="small"
                    variant="outlined"
                    name="name"
                    value={field.name}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <TextField
                    size="small"
                    variant="outlined"
                    name="unit"
                    value={field.unit}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Stack>
              ))}
            </Stack>
          </Container>
        </Stack>

        <Typography variant="h4">Danger Zone</Typography>

        <Box
          sx={{
            border: "1px solid rgba(0, 0, 0, 0.12)",
            borderRadius: 1,
            padding: 1,
          }}
        >
          <Typography variant="h6">Delete device model</Typography>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent={{ md: "space-between" }}
            spacing={1}
          >
            <Typography>
              Once you delete this device model, there is no going back. Please
              be certain.
            </Typography>
            <Button
              sx={{ whiteSpace: "nowrap", minWidth: "max-content" }}
              color="error"
              variant="outlined"
              onClick={handleClickDeleteDeviceModel}
            >
              Delete device model
            </Button>
          </Stack>
        </Box>
      </Container>

      <Dialog
        open={deleteDeviceModelOpen}
        onClose={handleCancelDeleteDeviceModel}
      >
        <DialogTitle>Delete device model confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure to continue?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDeleteDeviceModel}>Cancel</Button>
          <Button
            onClick={handleConfirmDeleteDeviceModel}
            autoFocus
            color="error"
          >
            Delete device model
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
