import { Box, Container, Stack, Typography } from "@mui/material";

export default function NotFound() {
  return (
    <Box sx={{ height: 1, bgcolor: "background.default", overflow: "auto" }}>
      <Container fixed>
        <Stack spacing={1}>
          <Typography variant="h3">Not Found</Typography>
        </Stack>
      </Container>
    </Box>
  );
}
