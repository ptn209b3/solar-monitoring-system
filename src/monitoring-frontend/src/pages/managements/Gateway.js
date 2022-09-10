import React from "react";

import { Link as RouterLink, useParams } from "react-router-dom";
import { Box, Container, Stack, Button, Typography } from "@mui/material";

import { PageTitle, QueryList } from "../../components";
import { useGetEntity } from "../../features/api";

import SolarPowerIcon from "@mui/icons-material/SolarPower";
import SpeedIcon from "@mui/icons-material/Speed";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import DeviceUnknownIcon from "@mui/icons-material/DeviceUnknown";
import AppSettingsAltIcon from "@mui/icons-material/AppSettingsAlt";

function Gateway() {
  const { siteId, gatewayId } = useParams();

  const deviceModelQuery = useGetEntity(
    [{ type: "DeviceModel", refSite: siteId, refGateway: gatewayId }],
    { initialData: [] }
  );

  const deviceQuery = useGetEntity(
    [{ type: "Device", refSite: siteId, refGateway: gatewayId }],
    { initialData: [] }
  );
  const inverterQuery = useGetEntity(
    [{ type: "Inverter", refSite: siteId, refGateway: gatewayId }],
    { initialData: [] }
  );
  const powerMeterQuery = useGetEntity(
    [{ type: "PowerMeter", refSite: siteId, refGateway: gatewayId }],
    { initialData: [] }
  );
  const weatherStationQuery = useGetEntity(
    [{ type: "WeatherStation", refSite: siteId, refGateway: gatewayId }],
    { initialData: [] }
  );

  return (
    <Box sx={{ bgcolor: "background.default", height: 1, overflow: "auto" }}>
      <Container fixed maxWidth="xs">
        <Stack spacing={1}>
          <PageTitle>Manage Gateway</PageTitle>

          <Typography variant="h6">GatewayId</Typography>
          <Typography>{gatewayId}</Typography>

          <Typography variant="h6">Inverters</Typography>
          <QueryList
            queryProps={inverterQuery}
            icon={SolarPowerIcon}
            baseUrl="Inverter"
          />
          <Typography variant="h6">Power Meters</Typography>
          <QueryList
            queryProps={powerMeterQuery}
            icon={SpeedIcon}
            baseUrl="PowerMeter"
          />
          <Typography variant="h6">Weather Stations</Typography>
          <QueryList
            queryProps={weatherStationQuery}
            icon={ThermostatIcon}
            baseUrl="WeatherStation"
          />

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h6">Provisioned Devices</Typography>
            <Button component={RouterLink} to="provision">
              Provision New
            </Button>
          </Stack>
          <QueryList
            queryProps={deviceQuery}
            icon={DeviceUnknownIcon}
            baseUrl="Device"
          />

          <Typography variant="h6">Device Models</Typography>
          <QueryList
            queryProps={deviceModelQuery}
            icon={AppSettingsAltIcon}
            baseUrl="DeviceModel"
          />
        </Stack>
      </Container>
    </Box>
  );
}

export default Gateway;
