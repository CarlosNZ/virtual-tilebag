import React, { useState, useEffect } from "react";
import logo from "../img/vt_icon.png";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Typography,
  Grid,
  Container,
  CssBaseline,
  Paper,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Snackbar,
  SnackbarContent,
  Link,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(5),
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(2),
    },
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export const Home = () => {
  const classes = useStyles();
  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />

      <div>
        <Paper className={classes.paper}>
          <Grid item xs={12} center>
            <img style={{ width: "100%", maxWidth: 300 }} src={logo} alt="main-icon" />
          </Grid>
          <Grid item>
            <Typography component="h1" variant="h3" align="center" gutterBottom>
              virtual tilebag
            </Typography>
            <Typography>An online solution to real world Scrabble -- while in Lockdown.</Typography>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            className={classes.submit}
            value="Create game"
            href="./new-game"
            // onClick={initGame}
          >
            Start a new game.
          </Button>
          <Link variant="body1" href="./About">
            About, how to, FAQ, etc.
          </Link>
        </Paper>
      </div>
    </Container>
  );
};

export default Home;
