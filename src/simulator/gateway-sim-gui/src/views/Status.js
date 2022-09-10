import { useState } from "react";

import { green, red } from "@material-ui/core/colors";

import Button from "@material-ui/core/Button";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  Status: {
    flexGrow: 1,

    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
}));

function Status() {
  const classes = useStyles();
  const [isRunning, setIsRunning] = useState(false);

  function handleStart() {
    setIsRunning(true);
  }
  function handleStopAll() {
    setIsRunning(false);
  }
  return (
    <div className={classes.Status}>
      <div>Device in active: 27</div>
      <div>Status: {isRunning ? "Running" : "Halted"}</div>
      {isRunning ? (
        <Button onClick={handleStopAll} style={{ backgroundColor: red[500] }}>
          Stop all
        </Button>
      ) : (
        <Button onClick={handleStart} style={{ backgroundColor: green[500] }}>
          Start
        </Button>
      )}
    </div>
  );
}

export default Status;
