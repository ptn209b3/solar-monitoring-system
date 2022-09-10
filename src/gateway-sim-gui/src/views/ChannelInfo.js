import Paper from "@material-ui/core/Paper";

import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
}));

export default function Channel() {
  const classes = useStyles();

  return <Paper className={classes.root}>Channel Info</Paper>;
}
