import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import * as FirestoreDb from "../services/firebase";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { Typography, FormControl, InputLabel, Select, MenuItem, TextField, Grid } from "@material-ui/core";

const PlayerNameInput = (props) => {
  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(1),
    },
  }));

  const classes = useStyles();

  return (
    <Grid item>
      <FormControl variant="outlined" className={classes.formControl}>
        <TextField
          id="outlined-basic"
          label={"Player " + props.playerNum + " name"}
          variant="outlined"
          onChange={(e) => (props.playerNames[props.playerNum - 1] = e.target.value)}
        />
      </FormControl>
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

  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 200,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

  const classes = useStyles();

  return (
    <Grid container spacing={3} justify="center">
      <Grid item xs={12}>
        <Typography variant="h5" align="center">
          Create a new game
        </Typography>
      </Grid>
      <Grid item>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="how-many-players">How many players?</InputLabel>
          <Select
            labelId="how-many-players"
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
      <Grid container spacing={3} justify="center">
        {createPlayerInputFields(playerNum)}
      </Grid>
      <Grid item>
        <Button variant="contained" color="primary" type="submit" value="Create game" onClick={initGame}>
          Create game
        </Button>
      </Grid>
    </Grid>
  );
};

export default NewGame;
