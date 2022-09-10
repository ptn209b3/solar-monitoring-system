import React from "react";
// import produce from "immer";
import {
  Box,
  Container,
  Stack,
  Typography,
  TextField,
  Divider,
  Button,
} from "@mui/material";

import PageTitle from "../../components/PageTitle";

import { useAddEntity, useGetEntity } from "../../features/api";

import { useNavigate, useParams } from "react-router-dom";
import ProgressButton from "../../components/ProgressButton";
import CustomSelect from "../../components/CustomSelect";

export default function GenericDeviceNew({ deviceType }) {
  const { value: typeValue, label: typeLabel } = deviceType;
  const { siteId, gatewayId } = useParams();

  const {
    isLoading,
    isError,
    isSuccess,
    mutate: addGenericDevice,
  } = useAddEntity([{ type: typeValue }]);

  const [name, setName] = React.useState(`${typeLabel} 1`);

  const { data: deviceModels } = useGetEntity(
    [{ type: "DeviceModel", deviceType: typeValue }],
    { initialData: [] }
  );
  const [selectedDeviceModel, setSelectedDeviceModel] = React.useState("");
  const [deviceModelFields, setDeviceModelFields] = React.useState([]);
  React.useEffect(() => {
    setDeviceModelFields(
      (deviceModels.find((item) => item._id === selectedDeviceModel) || null)
        ?.fields?.value || []
    );
  }, [deviceModels, selectedDeviceModel]);
  const [fields, setFields] = React.useState({});
  React.useEffect(() => {
    const newFields = {};
    deviceModelFields.forEach((field) => {
      newFields[field.name] = "";
    });
    setFields(newFields);
  }, [deviceModelFields]);
  function handleChangeFields(e) {
    setFields((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  const { data: devices } = useGetEntity(
    [{ type: "Device", refGateway: gatewayId }],
    { initialData: [] }
  );
  const [selectedDevice, setSelectedDevice] = React.useState("");
  const device = devices.find((item) => item._id === selectedDevice) || null;
  const fieldOptions = device
    ? Object.keys(device)

        .filter(
          (key) =>
            typeof device[key] === "object" && device[key].type === "number"
        )
        .map((key) => ({ value: key, label: key }))
    : [];

  const cantSubmit = false;

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!cantSubmit) {
      const newGenericDevice = {
        type: { type: "string", value: typeValue },
        name: { type: "string", value: name },
        refGateway: { type: "string", value: gatewayId },
        refSite: { type: "string", value: siteId },
      };
      for (const key in fields) {
        newGenericDevice[key] = {
          type: "link",
          value: `${selectedDevice}.${fields[key]}`,
        };
      }

      addGenericDevice(newGenericDevice);
    }
  };

  function handleSelectDevice(e) {
    setSelectedDevice(e.target.value);
  }

  return (
    <Box sx={{ height: 1, bgcolor: "background.default", overflow: "auto" }}>
      <Container maxWidth="xs">
        <Stack spacing={1}>
          <PageTitle>New {typeLabel}</PageTitle>
          <TextField
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            label={`${typeLabel} name`}
          />
          <CustomSelect
            options={devices.map(({ _id, name, deviceName }) => ({
              label: deviceName?.value || name?.value || _id,
              value: _id,
            }))}
            value={selectedDevice}
            onChange={handleSelectDevice}
            label="Select Device"
            fullWidth
          />

          <Box>
            <CustomSelect
              options={deviceModels.map(({ _id, name }) => ({
                label: name?.value || _id,
                value: _id,
              }))}
              value={selectedDeviceModel}
              onChange={(e) => setSelectedDeviceModel(e.target.value)}
              label="Select Device Model"
              fullWidth
            />
          </Box>

          <Divider />
          <Typography variant="h6">Fields</Typography>
          <Stack spacing={1}>
            {deviceModelFields.map(({ name, unit }) => (
              <Stack
                direction="row"
                spacing={1}
                key={name}
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography sx={{ flexGrow: 1 }}>
                  {name} ({unit || "n/a"})
                </Typography>
                <CustomSelect
                  options={fieldOptions}
                  value={fields[name] || ""}
                  onChange={handleChangeFields}
                  label="Device Field"
                  sx={{ width: 200 }}
                  size="small"
                  name={name}
                />
              </Stack>
            ))}
          </Stack>
          <Divider />

          <Stack alignItems="center">
            <ProgressButton
              onClick={handleSubmit}
              disabled={cantSubmit}
              requestProps={{ isLoading: isLoading, isError: isError }}
            >
              Add {typeLabel}
            </ProgressButton>
            {isSuccess && (
              <Button
                onClick={() => navigate("..")}
                color="success"
                variant="contained"
              >
                Successful, go back
              </Button>
            )}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
