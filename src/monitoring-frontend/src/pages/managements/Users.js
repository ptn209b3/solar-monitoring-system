import React from "react";
import { Link as RouterLink } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import {
  TextField,
  InputAdornment,
  Button,
  Box,
  Container,
  Stack,
} from "@mui/material";
import { GridActionsCellItem } from "@mui/x-data-grid";
import SettingsIcon from "@mui/icons-material/Settings";

import PageTitle from "../../components/PageTitle";
import QueryTable from "../../components/QueryTable";
import { useGetUser } from "../../features/api";

export default function Users() {
  const queryProps = useGetUser();

  const columns = [
    {
      field: "username",
      headerName: "User Name",
      width: 200,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "role",
      headerName: "Role",
      width: 100,
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      getActions: (params) => [
        <GridActionsCellItem
          icon={<SettingsIcon />}
          label="Manage"
          showInMenu
          component={RouterLink}
          to={params.row.id}
        />,
      ],
    },
  ];

  return (
    <Box sx={{ height: 1, bgcolor: "background.default", overflow: "auto" }}>
      <Container fixed>
        <Stack spacing={1}>
          <PageTitle>User managements</PageTitle>

          <Stack direction="row" justifyContent="space-between">
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              size="small"
              placeholder="Find a user by username..."
            />

            <Button variant="outlined" component={RouterLink} to="new">
              Add User
            </Button>
          </Stack>

          <Box height={400}>
            <QueryTable queryProps={queryProps} tableProps={{ columns }} />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
