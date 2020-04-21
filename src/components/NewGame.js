import React, { useState } from "react";
import logo from "../img/vt_icon.png";
import { makeStyles } from "@material-ui/core/styles";
import * as FirestoreDb from "../services/firebase";
import { useHistory } from "react-router-dom";
import {
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Container,
  CssBaseline,
  Paper,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(2),
      // width: theme.spacing(16),
      // height: theme.spacing(16),
    },
  },
  paper: {
    marginTop: theme.spacing(5),
    display: "flex",
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

const PlayerNameInput = (props) => {
  return (
    <Grid item xs={12} sm={6}>
      <TextField
        id="outlined-basic"
        label={"Player " + props.playerNum + " name"}
        variant="outlined"
        onChange={(e) => (props.playerNames[props.playerNum - 1] = e.target.value)}
      />
    </Grid>
  );
};

export const NewGame = () => {
  const [playerNum, setPlayerNum] = useState(2);
  const playerNames = useState(["", "", "", ""]);
  let history = useHistory();

  const createPlayerInputFields = (num) => {
    let playerArray = [];
    for (let i = 1; i <= num; i++) {
      playerArray.push(<PlayerNameInput key={i} playerNum={i} playerNames={playerNames} />);
    }
    return playerArray;
  };

  const initGame = (e) => {
    let gameId = "";
    e.preventDefault();

    // Create game in Database and go to game URL
    FirestoreDb.createGame(playerNames.filter((p) => p !== ""))
      .then((docRef) => {
        console.log(docRef.id);
        gameId = docRef.id;
      })
      .then(() => {
        history.push("/game/id-" + gameId + "/p1");
        //TO DO : Add error/fail option (.catch?)
      });
  };

  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />

      <div className={classes.paper}>
        <Paper className={classes.root}>
          <Grid item xs={12} center>
            <div id="main-icon" style={{ textAlign: "center" }}>
              <img style={{ width: 80 }} src={logo} alt="main-icon" />
            </div>
          </Grid>
          <Grid item xs={12}>
            <Typography component="h1" variant="h5" align="center">
              Start a new game
            </Typography>
          </Grid>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel id="how-many-players">How many players?</InputLabel>
                  <Select
                    labelId="how-many-players"
                    required
                    name="playerNum"
                    id="selectNum"
                    value={playerNum}
                    label="How many players?"
                    onChange={(e) => setPlayerNum(e.target.value)}
                  >
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {createPlayerInputFields(playerNum)}
            </Grid>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              className={classes.submit}
              value="Create game"
              onClick={initGame}
            >
              Create game
            </Button>
          </form>
        </Paper>
      </div>
    </Container>
  );
};

export default NewGame;
