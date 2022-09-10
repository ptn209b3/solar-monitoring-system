import React from "react";
import { styled } from "@mui/material/styles";
import { Paper, Chip } from "@mui/material";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import { useGetAuth, useGetEntity } from "../../features/api";

import {
  IconButton,
  Box,
  Stack,
  Typography,
  Divider,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import SampleChart from "./SampleChart";

const TopBar = (
  <Stack direction="row" alignItems="center">
    <IconButton sx={{ borderRadius: 0 }}>
      <ArrowDropDownIcon />
    </IconButton>
    <Typography variant="subtitle2">Solar Energy</Typography>
  </Stack>
);

const ToolBar = (
  <Box display="flex" gap={1} flexWrap="wrap" padding={1}>
    <Chip label="All States" onClick={() => {}} />
    <Chip label="Normal" color="success" onClick={() => {}} />
    <Chip label="Underperformed" color="warning" onClick={() => {}} />
    <Chip label="Malfunctioned" color="error" onClick={() => {}} />
    <Chip label="Connection Interrupted" onClick={() => {}} />
  </Box>
);

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  padding: theme.spacing(2),
}));

function OperatingStateChip({ operatingState }) {
  let label;
  let color;

  switch (operatingState?.value) {
    case "normal":
      label = "Normal";
      color = "success";
      break;
    case "underperformed":
      label = "Underperformed";
      color = "warning";
      break;
    case "malfunctioned":
      label = "Malfunctioned";
      color = "error";
      break;
    case "connectionInterrupted":
      label = "Connection Interrupted";
      break;
    default:
      label = "Unknown";
      break;
  }
  return <Chip label={label} color={color} />;
}

function SiteList() {
  const { data: auth, isSuccess } = useGetAuth();

  const { data: sites } = useGetEntity([{ type: "Site", refUser: auth?._id }], {
    initialData: [],
    enabled: isSuccess,
  });

  const navigate = useNavigate();

  return (
    <Stack height={1} bgcolor="background.default" overflow="auto">
      {TopBar}
      {ToolBar}
      <Divider flexItem />

      <Grid container spacing={2} padding={2}>
        {sites.map(
          ({
            _id,
            name,
            operatingState,
            capacity,
            production,
            irradiation,
            powerRatio,
            activePower,
          }) => (
            <Grid item xs={12} md={6} xl={4} key={_id}>
              <Item
                elevation={2}
                onClick={() => navigate("/site-monitor/site-view/" + _id)}
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                    boxShadow:
                      "0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 6px 10px 0px rgb(0 0 0 / 14%), 0px 1px 18px 0px rgb(0 0 0 / 12%)",
                  },
                }}
              >
                <Stack direction="row" alignItems="center" gap={1}>
                  <OperatingStateChip operatingState={operatingState} />
                  <Typography>{name.value}</Typography>
                  <Typography>
                    <strong>
                      ({capacity?.value || "--"}
                      {capacity?.unit})
                    </strong>
                  </Typography>
                </Stack>

                <Stack direction="row">
                  <Box width={300} height={200}>
                    <SampleChart />
                  </Box>

                  <Stack flexGrow={1} justifyContent="space-between">
                    <Stack direction="row" justifyContent="space-between">
                      <Typography>Production</Typography>
                      <Typography>
                        <strong>
                          {production?.value || "--"} {production?.unit}
                        </strong>
                      </Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between">
                      <Typography>Irradiation</Typography>
                      <Typography>
                        <strong>
                          {irradiation?.value || "--"} {irradiation?.unit}
                        </strong>
                      </Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between">
                      <Typography>Power Ratio</Typography>
                      <Typography>
                        <strong>
                          {powerRatio?.value || "--"} {powerRatio?.unit}
                        </strong>
                      </Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between">
                      <Typography>Active Power</Typography>
                      <Typography>
                        <strong>
                          {activePower?.value || "--"} {activePower?.unit}
                        </strong>
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Item>
            </Grid>
          )
        )}
      </Grid>
    </Stack>
  );
}

export default React.memo(SiteList);
