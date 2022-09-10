import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Container,
  Stack,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  CircularProgress,
} from "@mui/material";

import PageTitle from "../../components/PageTitle";
import QueryTable from "../../components/QueryTable";
import { useIoT } from "../../lib/iot-lib";
// import ProgressButton from "../../components/ProgressButton";
import { getTimestamp, getValue } from "../../utils";
import { useGetEntity } from "../../features/api";
const steps = [
  { label: "Begin provision" },
  { label: "Waiting for provision" },
  { label: "Review and finishing" },
];

const columns = [
  { field: "name", headerName: "Name", valueGetter: getValue, width: 120 },
  { field: "id", headerName: "Id", width: 230 },
  {
    field: "createdOn",
    headerName: "Created on",
    valueGetter: getTimestamp,
    width: 150,
  },
];

export default function GatewayProvision() {
  const { gatewayId } = useParams();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = React.useState(0);

  const [done, setDone] = React.useState(false);
  const entityQuery = useGetEntity(
    [{ type: "Device", refGateway: gatewayId }],
    {
      initialData: [],
      enabled: done,
    }
  );
  const { data } = useIoT(`provision.${gatewayId}`, {
    initialData: { value: false },
  });

  React.useEffect(() => {
    if (data.value) {
      setDone(data.value);
      setActiveStep((prev) => prev + 1);
    }
  }, [data]);
  console.log("data", data);

  async function handleStart() {
    try {
      // await beginProvision(gatewayId).unwrap();
      nextStep();
      return;
    } catch (err) {
      console.log(err);
    }
  }

  async function handleStop() {
    try {
      // await endProvision(gatewayId).unwrap();
      setDone(true);
      nextStep();
    } catch (err) {
      console.log(err.message);
    }
  }

  function nextStep() {
    setActiveStep((prev) => prev + 1);
  }

  const firstStep = (
    <Stack
      sx={{ height: 300 }}
      justifyContent="space-evenly"
      alignItems="center"
    >
      <Typography>
        Click the button below to start provision for this gateway
      </Typography>
      {/* <ProgressButton
        onClick={handleStart}
        variant="outlined"
        requestProps={beginRequestProps}
      >
        Start Provisioning
      </ProgressButton> */}
      <Button onClick={handleStart} variant="outlined">
        Start Provisioning
      </Button>
    </Stack>
  );
  const secondStep = (
    <Stack
      sx={{ height: 300 }}
      justifyContent="space-evenly"
      alignItems="center"
    >
      <Typography>Waiting for provision message</Typography>
      <CircularProgress />
      {/* <ProgressButton onClick={handleStop} requestProps={endRequestProps}>
        Stop provisioning
      </ProgressButton> */}
      <Button onClick={handleStop}>Stop provisioning</Button>
    </Stack>
  );
  const lastStep = (
    <Stack sx={{ flex: 1 }} justifyContent="space-evenly" alignItems="center">
      <Typography>Provision Result</Typography>

      <Box width={1} height={400}>
        <QueryTable queryProps={entityQuery} tableProps={{ columns }} />
      </Box>
      <Stack spacing={1} direction="row">
        <Button
          variant="outlined"
          onClick={() => {
            setActiveStep(0);
          }}
        >
          Provision Again
        </Button>
        <Button variant="contained" onClick={nextStep}>
          Finish Provision
        </Button>
      </Stack>
    </Stack>
  );

  const resultStep = (
    <Stack
      sx={{ height: 300 }}
      justifyContent="space-evenly"
      alignItems="center"
    >
      <Typography variant="h3">Done!</Typography>
      <Typography>Go to devices page to see provisioned devices</Typography>
      <Button onClick={() => navigate("..")}>Go to devices page</Button>
      <Button
        onClick={() => {
          setActiveStep(0);
        }}
      >
        Provision Again
      </Button>
    </Stack>
  );

  let content;

  switch (activeStep) {
    case 0:
      content = firstStep;
      break;
    case 1:
      content = secondStep;
      break;
    case 2:
      content = lastStep;
      break;
    default:
      content = resultStep;
      break;
  }

  return (
    <Box sx={{ height: 1, bgcolor: "background.default", overflow: "auto" }}>
      <Stack spacing={1} sx={{ height: 1 }}>
        <Container fixed>
          <PageTitle>Devices Provision for Gateway</PageTitle>
        </Container>

        <Stack alignItems="center" sx={{ flex: 1 }}>
          <Container maxWidth="sm" sx={{ flex: 1 }}>
            <Stack sx={{ height: 1 }}>
              <Stepper activeStep={activeStep}>
                {steps.map(({ label }) => {
                  return (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>

              {content}
            </Stack>
          </Container>
        </Stack>
      </Stack>
    </Box>
  );
}
