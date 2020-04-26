import React from "react";
import logo from "../img/vt_icon.png";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Grid, Link } from "@material-ui/core";

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
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

export const Header = () => {
  const classes = useStyles();

  return (
    <Grid id="header" container direction="row" justify="space-between" alignItems="center" className={classes.header}>
      <Grid container direction="row" alignItems="center">
        <Grid item>
          <Link href="/">
            <img style={{ width: 30, marginRight: 10 }} src={logo} alt="main-icon" />
          </Link>
        </Grid>
        <Grid item>
          <Typography variant="h6" color="primary" gutterBottom>
            <Link href="/" underline="none">
              virtual tilebag
            </Link>
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};
