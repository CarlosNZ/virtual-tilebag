import React from "react";
import logo from "../img/vt_icon.png";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(1),
      width: theme.spacing(16),
      height: theme.spacing(16),
    },
  },
  header: {
    margin: theme.spacing(1),
  },
}));

export const Header = () => {
  const classes = useStyles();

  return (
    <Grid
      id="header"
      container
      xs={12}
      direction="row"
      justify="space-between"
      alignItems="center"
      className={classes.header}
    >
      <Grid container direction="row" xs={6} alignItems="center">
        <Grid item>
          <img style={{ width: 30, marginRight: 10 }} src={logo} alt="main-icon" />
        </Grid>
        <Grid item>
          <Typography variant="h6" color="primary" gutterBottom="true">
            virtual tilebag
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};
