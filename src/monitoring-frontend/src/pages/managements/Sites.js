import { withDeviceType } from "../../components";

import React from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import {
  Button,
  Box,
  Container,
  Stack,
  useMediaQuery,
  Typography,
} from "@mui/material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import SettingsIcon from "@mui/icons-material/Settings";

import { getValue, getTimestamp } from "../../utils";
import { PageTitle, CustomList, QueryTable } from "../../components";
import { useGetAuth, useGetEntity } from "../../features/api";

const columns = [
  { field: "name", headerName: "Name", valueGetter: getValue, width: 200 },
  {
    field: "createdOn",
    headerName: "Created on",
    valueGetter: getTimestamp,
    width: 160,
  },
  {
    field: "actions",
    headerName: "Actions",
    type: "actions",
    getActions: (params) => [
      <GridActionsCellItem
        icon={<SettingsIcon />}
        label="Manage"
        component={RouterLink}
        to={params.row.id}
      />,
    ],
  },
];

function Entities({ deviceType }) {
  const { siteId, gatewayId } = useParams();

  const { data: auth, isSuccess } = useGetAuth();

  const queryProps = useGetEntity(
    [
      {
        type: deviceType.value,
        ...(siteId && { refSite: siteId }),
        ...(gatewayId && { refGateway: gatewayId }),
        refUser: auth?._id,
      },
    ],
    { initialData: [], enabled: isSuccess }
  );
  const listItems = queryProps.data.map(({ id, name, deviceName }) => ({
    id: id,
    to: id,
    primary: name?.value || deviceName?.value || id,
  }));

  const onDesktop = useMediaQuery("(min-width:600px)");

  return (
    <Box sx={{ height: 1, bgcolor: "background.default", overflow: "auto" }}>
      <Container fixed>
        <Stack spacing={1}>
          <PageTitle>Manage {deviceType.label}s</PageTitle>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h6">{deviceType.label}s</Typography>
            <Stack direction="row" spacing={1}>
              <Button component={RouterLink} to="new">
                Add One
              </Button>
              <Button component={RouterLink} to="./..">
                Back
              </Button>
            </Stack>
          </Stack>

          <Box height={400}>
            {onDesktop ? (
              <QueryTable queryProps={queryProps} tableProps={{ columns }} />
            ) : (
              <CustomList items={listItems} />
            )}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

export default withDeviceType(Entities, {
  value: "Site",
  label: "Site",
});
