import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Stack,
  useMediaQuery,
  Typography,
} from "@mui/material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import PreviewIcon from "@mui/icons-material/Preview";

import { getValue, getTimestamp } from "../../utils";
import { PageTitle, CustomList, QueryTable } from "../../components";
import { useGetAuth, useGetEntity } from "../../features/api";

const columns = [
  { field: "name", headerName: "Name", valueGetter: getValue },
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
        icon={<PreviewIcon />}
        label="Manage"
        component={RouterLink}
        to={params.row.id}
      />,
    ],
  },
];

export default function ViewSites() {
  const { data: auth } = useGetAuth();

  const queryProps = useGetEntity(
    [{ type: "Site", ...(auth && { refUser: auth._id }) }],
    { initialData: [], enabled: auth.isSuccess }
  );

  const listItems = queryProps.data.map(({ id, name }) => ({
    id: id,
    to: id,
    primary: name?.value || id,
  }));

  const onDesktop = useMediaQuery("(min-width:600px)");

  return (
    <Box sx={{ height: 1, bgcolor: "background.default", overflow: "auto" }}>
      <Container fixed>
        <Stack spacing={1}>
          <PageTitle>Choose a site to continue</PageTitle>

          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h6">Sites</Typography>
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
