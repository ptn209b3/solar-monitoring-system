import React from "react";
import { Box, Container, Stack, Divider, TextField } from "@mui/material";

import PageTitle from "../../components/PageTitle";
import ProgressButton from "../../components/ProgressButton";
import { useAddEntity } from "../../features/api";

import { useParams, useNavigate } from "react-router-dom";

export default function GatewayNew() {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    name: "",
  });

  const {
    isLoading,
    isError,
    mutate: addGateway,
  } = useAddEntity([{ type: "Gateway" }]);

  function handleChangeFormData(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const { siteId } = useParams();

  const canAdd = Boolean(formData.name) && !isLoading;

  const handleAddGateway = async () => {
    if (canAdd) {
      const newGateway = {
        type: {
          type: "string",
          value: "Gateway",
        },
        name: {
          type: "string",
          value: formData.name,
        },
        refSite: {
          type: "string",
          value: siteId,
        },
      };

      addGateway(newGateway);
      navigate("..");
    }
  };

  return (
    <Box sx={{ height: 1, bgcolor: "background.default", overflow: "auto" }}>
      <Container fixed>
        <Stack spacing={1}>
          <PageTitle>Add a new Gateway</PageTitle>

          <TextField
            label="Gateway Name"
            variant="outlined"
            name="name"
            value={formData.name}
            onChange={handleChangeFormData}
          />

          <Divider />

          <Box>
            <ProgressButton
              onClick={handleAddGateway}
              disabled={!canAdd}
              variant="contained"
              requestProps={{
                isLoading,
                isError,
              }}
            >
              Add Gateway
            </ProgressButton>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
