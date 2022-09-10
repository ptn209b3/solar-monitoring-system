import React from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

import { PageTitle, QueryList } from "../../components";
import { useGetEntity } from "../../features/api";

export default function Site() {
  const { siteId } = useParams();
  const gatewayQuery = useGetEntity([{ type: "Gateway", refSite: siteId }], {
    initialData: [],
  });

  return (
    <Box sx={{ height: 1, bgcolor: "background.default", overflow: "auto" }}>
      <Container fixed>
        <Stack spacing={1}>
          <PageTitle>Manage Site</PageTitle>

          <Typography variant="h6">Gateways</Typography>
          <QueryList queryProps={gatewayQuery} baseUrl="gateways" />
        </Stack>
      </Container>
    </Box>
  );
}
