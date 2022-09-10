import React from "react";
import dayjs from "dayjs";
import InverterIcon from "../../images/InverterIcon.png";
import MeterIcon from "../../images/MeterIcon.png";
import GridIcon from "../../images/GridIcon.png";
import EnergyHouseIcon from "../../images/power_icon_green.svg";

import {
  Box,
  Stack,
  Typography,
  IconButton,
  Divider,
  Link,
  Paper,
  Grid,
} from "@mui/material";
import { useParams } from "react-router-dom";

import {
  QueryTable,
  CustomToggleButton,
  CustomDatePicker,
} from "../../components";
import { getValue } from "../../utils";

import {
  useGetEntity,
  useGetEntityById,
  useGetRecords,
} from "../../features/api";

import ProductionIrradiationChart from "./ProductionIrradiationChart";
import PowerIrradianceChart from "./PowerIrradianceChart";
import { pickerUnitOptions, timeUnitOptions } from "../../features/constants";
import { useIoT } from "../../lib/iot-lib";

function RealtimeMetric({ entityField }) {
  const { data } = useIoT("telemetry." + entityField);
  return data.value;
}

const inverterColumns = [
  { field: "name", headerName: "Name", valueGetter: getValue, width: 100 },
  {
    field: "Yield",
    headerName: "Yield",
    width: 100,
  },
  {
    field: "Production",
    headerName: "Production",
    valueGetter: getValue,
    renderCell: (params) => <RealtimeMetric entityField={params.value} />,
    width: 100,
  },
  {
    field: "Power Ratio",
    headerName: "Power Ratio (%)",
    width: 150,
  },
];

export default function SiteView() {
  const { siteId } = useParams();
  const { data: site } = useGetEntityById([siteId], { initialData: null });

  const [timeUnit, setTimeUnit] = React.useState();
  const pickerUnit = pickerUnitOptions[timeUnit];
  const [date, setDate] = React.useState(dayjs());

  const inverterQuery = useGetEntity(
    [{ type: "Inverter", ...(siteId && { refSite: siteId }) }],
    { initialData: [] }
  );
  const weatherStationQuery = useGetEntity(
    [{ type: "WeatherStation", ...(siteId && { refSite: siteId }) }],
    { initialData: [] }
  );

  const production = useGetRecords(
    [
      inverterQuery.data.map((inverter) =>
        inverter.Production.value.split(".")
      ),
      {
        unit: timeUnit,
        operator: "last",
        ...(pickerUnit && {
          from: date.startOf(pickerUnit).toISOString(),
          to: date.endOf(pickerUnit).toISOString(),
        }),
      },
    ],
    { enabled: Boolean(timeUnit) }
  );

  const power = useGetRecords(
    [
      inverterQuery.data.map((inverter) => inverter.Power.value.split(".")),
      {
        unit: timeUnit,
        operator: "last",
        ...(pickerUnit && {
          from: date.startOf(pickerUnit).toISOString(),
          to: date.endOf(pickerUnit).toISOString(),
        }),
      },
    ],
    { enabled: Boolean(timeUnit) }
  );

  const irradience = useGetRecords(
    [
      weatherStationQuery.data.map((weatherStation) =>
        weatherStation.Irradiance.value.split(".")
      ),
      {
        unit: timeUnit,
        operator: "last",
        ...(pickerUnit && {
          from: date.startOf(pickerUnit).toISOString(),
          to: date.endOf(pickerUnit).toISOString(),
        }),
      },
    ],
    { enabled: Boolean(timeUnit) }
  );

  return (
    <Box flex={1} height={1} bgcolor="background.default" overflow="auto">
      <Stack spacing={1} padding={1}>
        <Paper>
          <Stack direction="row" spacing={1} sx={{ height: 80 }}>
            <Stack direction="row" sx={{ flex: 2 }} alignItems="center">
              <Box sx={{ px: 4 }}>
                <img
                  src={EnergyHouseIcon}
                  alt="EnergyHouseIcon"
                  style={{ width: 48, height: 48 }}
                />
              </Box>
              <Stack sx={{ flex: 1 }} alignItems="center">
                <Box>
                  <Typography>Operation State</Typography>
                  <Typography>Normal</Typography>
                </Box>
              </Stack>
            </Stack>

            <Stack sx={{ flex: 3 }} alignItems="center" justifyContent="center">
              <Box>
                <Typography>
                  Inverter ({inverterQuery.data.length}) <Link>Details</Link>
                </Typography>
              </Box>
            </Stack>

            <Divider orientation="vertical" flexItem />

            <Stack sx={{ flex: 3 }} alignItems="center" justifyContent="center">
              <Typography>
                Alarm (0) <Link>Details</Link>
              </Typography>
              <Typography>Fault 0 Warning 0</Typography>
            </Stack>
          </Stack>
        </Paper>

        <Paper>
          <Stack padding={1} spacing={1}>
            <Stack
              direction={{ xs: "column", lg: "row" }}
              spacing={1}
              alignItems={{ xs: "stretch", lg: "center" }}
            >
              <CustomToggleButton
                options={timeUnitOptions.slice(0, 4)}
                value={timeUnit}
                setValue={setTimeUnit}
              />

              {pickerUnit && (
                <CustomDatePicker
                  value={date}
                  setValue={setDate}
                  unit={pickerUnit}
                />
              )}
            </Stack>

            <Box display="flex" flexWrap="wrap" justifyContent="space-around">
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2">Capacity</Typography>
                <Typography>{site?.capacity?.value || "--"}</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2">Irradiation</Typography>
                <Typography>--</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2">Yield</Typography>
                <Typography>--</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2">Production</Typography>
                <Typography>--</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2">Power Ratio</Typography>
                <Typography>--</Typography>
              </Stack>
            </Box>

            <Grid container>
              <Grid item xs={12} lg={6}>
                <Box height={300}>
                  <ProductionIrradiationChart
                    production={production}
                    unit={timeUnit}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} lg={6}>
                <Box height={300}>
                  <PowerIrradianceChart
                    power={power}
                    irradiance={irradience}
                    unit={timeUnit}
                  />
                </Box>
              </Grid>
            </Grid>
          </Stack>
        </Paper>

        <Grid container spacing={1}>
          <Grid item xs={12} lg={6}>
            <Paper>
              <Stack height={400} padding={1}>
                <Typography variant="h5">Inverter Ranking</Typography>
                <Box flex={1}>
                  <QueryTable
                    queryProps={inverterQuery}
                    tableProps={{ columns: inverterColumns }}
                  />
                </Box>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Paper>
              <Stack height={400} padding={1}>
                <Typography variant="h5">Production</Typography>
                <Box flex={1}>
                  <ProductionView />
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}

function ProductionView() {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-around"
      sx={{ height: 300 }}
    >
      <Stack alignItems="center" spacing={1}>
        <IconButton>
          <img
            src={InverterIcon}
            alt="InverterIcon"
            style={{ width: 48, height: 48 }}
          />
        </IconButton>
        <Typography>Inverter</Typography>
        <Typography>-- kWh</Typography>
      </Stack>
      <Stack alignItems="center" spacing={1}>
        <IconButton>
          <img
            src={MeterIcon}
            alt="MeterIcon"
            style={{ width: 48, height: 48 }}
          />
        </IconButton>
        <Typography>Energy Meter</Typography>
        <Typography>-- kWh</Typography>
      </Stack>
      <Stack alignItems="center" spacing={1}>
        <IconButton>
          <img
            src={GridIcon}
            alt="GridIcon"
            style={{ width: 48, height: 48 }}
          />
        </IconButton>
        <Typography>Grid</Typography>
        <Typography>-- kWh</Typography>
      </Stack>
    </Stack>
  );
}
