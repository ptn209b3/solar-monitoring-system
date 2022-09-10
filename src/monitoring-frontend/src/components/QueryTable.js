import React from "react";

import { DataGrid } from "@mui/x-data-grid";
import { Stack, Button, CircularProgress, Typography } from "@mui/material";

export default function QueryTable({ queryProps, tableProps }) {
  const { data = [], isFetching, isLoading, isError, refetch } = queryProps;
  let content;
  if (isLoading || isFetching) {
    content = (
      <Stack height={1} alignItems="center" justifyContent="center">
        <CircularProgress />
      </Stack>
    );
  } else if (isError) {
    content = (
      <Stack height={1} alignItems="center" justifyContent="center" spacing={1}>
        <Typography sx={{ color: "error.main" }}>An Error occurred.</Typography>
        <Button onClick={() => refetch()}>Refetch</Button>
      </Stack>
    );
  } else {
    content = (
      <DataGrid
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        rows={data}
        {...tableProps}
      />
    );
  }

  return content;
}
