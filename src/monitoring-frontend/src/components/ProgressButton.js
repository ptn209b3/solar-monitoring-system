import React from "react";

import { Box, Button, CircularProgress } from "@mui/material";

function ProgressButton({ children, requestProps, ...buttonProps }) {
  const { isLoading, isError, isSuccess } = requestProps;

  return (
    <Box sx={{ position: "relative" }} component="span">
      <Button
        color={isError ? "error" : isSuccess ? "success" : undefined}
        {...buttonProps}
      >
        {children}
      </Button>
      {isLoading && (
        <CircularProgress
          size={24}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            marginTop: "-12px",
            marginLeft: "-12px",
          }}
        />
      )}
    </Box>
  );
}

export default ProgressButton;
