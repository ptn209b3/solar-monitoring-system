import React from "react";

import { useNavigate } from "react-router-dom";

import {
  Divider,
  TextField,
  Typography,
  Stack,
  Box,
  Container,
  Button,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import ProgressButton from "../../components/ProgressButton";
// import Map from "../../components/Map";
import { useAddEntity, useGetAuth } from "../../features/api";

import Select from "../../components/CustomSelect";

export default function SiteNew() {
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState({
    name: "",
    capacity: "",
    capacityUnit: "Wp",
    installationDate: null,
    longtitude: "106.6576",
    latitude: "10.7728",
  });

  function handleChangeFormData(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
  function handleChangeInstallationDate(newDate) {
    setFormData({ ...formData, installationDate: newDate });
  }

  const { data: auth } = useGetAuth();

  const {
    isLoading,
    isError,
    mutate: addSite,
  } = useAddEntity([{ type: "Site" }]);

  function handleAddSite() {
    const newSite = {
      type: {
        type: "string",
        value: "Site",
      },
      name: {
        type: "string",
        value: formData.name,
      },
      capacity: {
        type: "number",
        value: Number(formData.capacity),
        unit: formData.capacityUnit,
      },
      installationDate: {
        type: "string",
        value: formData.installationDate.toISOString(),
      },
      longtitude: {
        type: "number",
        value: Number(formData.longtitude),
      },
      latitude: {
        type: "number",
        value: Number(formData.latitude),
      },
      refUser: {
        type: "string",
        value: auth?._id,
      },
    };

    addSite(newSite);
    navigate("..");
  }

  const capUnits = [
    { label: "Wp", value: "Wp" },
    { label: "kWp", value: "kWp" },
    { label: "MWp", value: "MWp" },
    { label: "GWp", value: "GWp" },
  ];

  return (
    <Box sx={{ height: 1, bgcolor: "background.default", overflow: "auto" }}>
      <Container maxWidth="xs">
        <Stack spacing={2}>
          <Typography variant="h4">Add a new site</Typography>

          <Divider />

          <TextField
            label="Site Name"
            variant="outlined"
            name="name"
            value={formData.name}
            onChange={handleChangeFormData}
          />

          <Stack direction="row" spacing={2}>
            <TextField
              label="Site Capacity"
              variant="outlined"
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChangeFormData}
              sx={{ flexGrow: 1 }}
            />

            <Select
              label="Unit"
              options={capUnits}
              name="capacityUnit"
              value={formData.capacityUnit}
              onChange={handleChangeFormData}
              sx={{ width: "120px" }}
            />
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography>Installation Date:</Typography>
            <DatePicker
              renderInput={(params) => <TextField {...params} />}
              inputFormat="DD/MM/YYYY"
              name="installationDate"
              value={formData.installationDate}
              onChange={handleChangeInstallationDate}
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <TextField
              label="Site Longtitude"
              name="longtitude"
              type="number"
              value={formData.longtitude}
              onChange={handleChangeFormData}
            />

            <TextField
              label="Site Latitude"
              type="number"
              name="latitude"
              value={formData.latitude}
              onChange={handleChangeFormData}
            />
          </Stack>

          {/* <Box sx={{ height: 300 }}>
            <Map />
          </Box> */}

          <Divider />

          <Stack spacing={2} direction="row">
            <ProgressButton
              onClick={handleAddSite}
              variant="contained"
              requestProps={{
                isLoading,
                isError,
              }}
            >
              Add Site
            </ProgressButton>
            <Button onClick={() => navigate("..")}>Cancel</Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
