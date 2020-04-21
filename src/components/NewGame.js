import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import * as FirestoreDb from "../services/firebase";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Container,
  CssBaseline,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
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
        <div className="main-icon">
          <img style={{ maxWidth: "100%" }} src="vt_icon.png" alt="main-icon" />
        </div>
        <Typography component="h1" variant="h5" align="center">
          Start a new game
        </Typography>
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
      </div>
    </Container>
  );
};

export default NewGame;
