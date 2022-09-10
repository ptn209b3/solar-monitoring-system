import React from "react";
import produce from "immer";
import {
  Box,
  Container,
  Stack,
  Typography,
  TextField,
  IconButton,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { useNavigate, useParams } from "react-router-dom";

import { PageTitle, ProgressButton, CustomSelect } from "../../components";
import { useAddEntity } from "../../features/api";

const deviceTypeOptions = [
  { value: "Inverter", label: "Inverter" },
  { value: "PowerMeter", label: "Power Meter" },
  { value: "WeatherStation", label: "Weather Station" },
];

export default function NewDeviceModel() {
  const { siteId, gatewayId } = useParams();
  const [fields, setFields] = React.useState([
    { name: "Production", unit: "" },
  ]);
  const [name, setName] = React.useState("Default Inverter 1");
  const [deviceType, setDeviceType] = React.useState("");

  function handleChange(event, index) {
    const { name, value } = event.target;
    setFields(
      produce((draft) => {
        draft[index][name] = value;
      })
    );
  }

  React.useEffect(() => {
    let lastRow = fields.at(-1);
    if (lastRow.name || lastRow.unit)
      setFields(
        produce((draft) => {
          draft.push({ name: "", unit: "" });
        })
      );
  }, [fields]);

  const canShow = Boolean(deviceType);

  const {
    isLoading,
    isSuccess,
    isError,
    mutate: addDeviceModel,
  } = useAddEntity([{ type: "DeviceModel" }]);
  const cantSubmit =
    fields.some((row) => !row.name && row.unit) ||
    !fields.some((row) => row.name) ||
    !Boolean(name) ||
    isLoading;

  const navigate = useNavigate();
  const handleSubmit = () => {
    if (!cantSubmit) {
      let newDeviceModel = {
        type: { type: "string", value: "DeviceModel" },
        refSite: { type: "string", value: siteId },
        refGateway: { type: "string", value: gatewayId },
        name: { type: "string", value: name },
        fields: { type: "array", value: fields.slice(0, fields.length - 1) },
        deviceType: { type: "string", value: deviceType },
      };
      addDeviceModel(newDeviceModel);
    }
  };

  return (
    <Box sx={{ height: 1, bgcolor: "background.default", overflow: "auto" }}>
      <Container maxWidth="xs">
        <Stack spacing={1}>
          <PageTitle>Add new device model</PageTitle>

          <Box>
            <Typography variant="h6">Model Name</Typography>
            <TextField
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              placeholder="E.g. SUN2000"
            />
          </Box>

          <Box>
            <Typography variant="h6">Choose Device Type</Typography>
            <CustomSelect
              options={deviceTypeOptions}
              value={deviceType}
              onChange={(e) => setDeviceType(e.target.value)}
              label=""
              fullWidth
            />
          </Box>

          {canShow && (
            <Stack spacing={1}>
              <Typography variant="h6">Fields and Unit (optional)</Typography>
              {fields.map((field, i) => (
                <Stack direction="row" sx={{ gap: 1 }} key={i}>
                  <TextField
                    size="small"
                    variant="outlined"
                    name="name"
                    value={field.name}
                    onChange={(e) => handleChange(e, i)}
                    sx={{ width: 140 }}
                    placeholder="E.g. Production"
                  />
                  <TextField
                    size="small"
                    variant="outlined"
                    name="unit"
                    value={field.unit}
                    onChange={(e) => handleChange(e, i)}
                    sx={{ width: 140 }}
                    placeholder="E.g. Wh"
                  />
                  {i !== fields.length - 1 ? (
                    <IconButton
                      onClick={() => {
                        setFields((prev) =>
                          prev.filter((item, prevIndex) => prevIndex !== i)
                        );
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  ) : null}
                </Stack>
              ))}
            </Stack>
          )}

          <Stack alignItems="center">
            <ProgressButton
              onClick={handleSubmit}
              disabled={cantSubmit}
              requestProps={{ isLoading, isError }}
            >
              Add Device Model
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
