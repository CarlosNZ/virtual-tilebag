import React, { useState, useEffect } from "react";
import logo from "../img/vt_icon.png";
import * as FirestoreDb from "../services/firebase";
import { shuffleBag, tilePointValues } from "../services/tilebag";
import { Modal } from "./Modal";
import { makeStyles } from "@material-ui/core/styles";
import PersonIcon from "@material-ui/icons/Person";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import {
  Button,
  Typography,
  Grid,
  Container,
  CssBaseline,
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
} from "@material-ui/core";

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
  turnIndicator: {
    margin: theme.spacing(1),
  },
  myTurn: {
    borderColor: "#hsla(115, 39%, 53%, 1)",
    backgroundColor: "hsla(115, 39%, 53%, 0.15)",
    boxShadow: "0px 0px 3px 2px hsla(115, 39%, 53%, 0.25)",
  },
  othersTurn: {
    borderColor: "hsla(38, 100%, 50%, 1.00)",
    backgroundColor: "hsla(38, 100%, 50%, 0.15)",
    boxShadow: "0px 0px 3px 2px hsla(38, 100%, 50%, 0.15)",
  },
  waiting: {
    borderColor: "hsla(8, 90%, 58%, 1.00)",
    backgroundColor: "hsla(8, 90%, 58%, 0.15)",
    boxShadow: "0px 0px 3px 2px hsla(8, 90%, 58%, 0.15)",
  },
  rack: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(4),
  },
  tile: {
    width: 50,
    height: 50,
    margin: theme.spacing(1),
    border: "1px solid #DCDCDC",
    backgroundColor: "#FFFDF0",
  },
  selectedTile: {
    transform: "translateY(-15px)",
    opacity: 0.7,
  },
}));

export const Game = (props) => {
  // const classes = useStyles();
  console.log("Game Re-render");

  // Game constants
  const gameId = props.match.params.gameID;
  const thisPlayer = parseInt(props.match.params.player);
  const tileBag = shuffleBag(gameId);

  return (
    <div>
      <Rack gameId={gameId} thisPlayer={thisPlayer} tileBag={tileBag} />
    </div>
  );
};

const Rack = (props) => {
  const classes = useStyles();
  console.log("Rack re-render");
  // State values
  const [rackSelectedIndices, setRackSelectedIndices] = useState(new Set());
  const [gameData, setGameData] = useState({});
  const [players, setPlayers] = useState([]);
  const [racks, setRacks] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(props.thisPlayer === 1);

  // Listener for changes to database -> update local state
  useEffect(() => {
    const unsubscribe = FirestoreDb.syncGameState(props.gameId, (doc) => {
      setGameData({
        currentPlayer: parseInt(doc.data().currentPlayer),
        tileBag: doc.data().tileBag,
      });
      setPlayers(doc.data().players);
      setRacks(doc.data().racks);
      console.log("Updating from database");
    });
    return unsubscribe;
    // eslint-disable-next-line
  }, []);

  // Once all players have drawn initial tiles, game becomes ready
  useEffect(() => {
    if (racks.filter((r) => r !== "").length === players.length && players.length > 0 && gameData.currentPlayer === 0) {
      FirestoreDb.updateState(props.gameId, "currentPlayer", 1);
      console.log("Game is ready...");
    }
    // eslint-disable-next-line
  }, [racks]);

  const rackStringToArray = (rackString) => {
    if (rackString === undefined) rackString = "";
    const rackArray = ["", "", "", "", "", "", ""];
    rackString.split("").map((letter, index) => (rackArray[index] = letter));
    return rackArray;
  };

  const getNewTiles = (swap) => {
    console.log(swap);
    const oldTiles = [];
    const selectedTilesIndices = gameData.currentPlayer === 0 ? [0, 1, 2, 3, 4, 5, 6] : Array.from(rackSelectedIndices);

    const newTiles = gameData.tileBag.slice(0, selectedTilesIndices.length);
    let newTileBag = gameData.tileBag.slice(selectedTilesIndices.length);
    const newRack = rackStringToArray(racks[props.thisPlayer - 1]);
    // eslint-disable-next-line
    selectedTilesIndices.map(function (i) {
      oldTiles.push(newRack[i]); // Keep old tile before it's swapped out
      newRack[i] = newTiles.pop();
    });
    const newRacks = [...racks];
    newRacks[props.thisPlayer - 1] = newRack.join("");
    FirestoreDb.updateState(props.gameId, "racks", newRacks);
    setRackSelectedIndices(new Set());
    const newPlayer =
      gameData.currentPlayer === 0 ? gameData.currentPlayer : (gameData.currentPlayer % players.length) + 1;
    if (swap === "swap") {
      newTileBag.push(...oldTiles);
      newTileBag = shuffleBag(Math.random(), newTileBag);
    }
    FirestoreDb.updateState(props.gameId, "currentPlayer", newPlayer);
    FirestoreDb.updateState(props.gameId, "tileBag", newTileBag);
  };

  const swapTiles = () => {
    console.log("Tilebag: ", gameData.tileBag.length, "Selected:", rackSelectedIndices);
    if (gameData.tileBag.length < rackSelectedIndices.size) {
      alert("Not enough tiles left in bag");
    } else getNewTiles("swap");
  };

  const toggleLetterSelected = (letterIndex) => {
    const tempSet = new Set(rackSelectedIndices);
    if (tempSet.has(letterIndex)) {
      tempSet.delete(letterIndex);
    } else tempSet.add(letterIndex);
    setRackSelectedIndices(tempSet);
  };

  const canUpdate =
    gameData.currentPlayer === props.thisPlayer || (gameData.currentPlayer === 0 && racks[props.thisPlayer - 1] === "");

  const gameStatus = () =>
    gameData.currentPlayer === 0 ? "waiting" : gameData.currentPlayer === props.thisPlayer ? "myTurn" : "othersTurn";

  const handleClose = () => {
    setDialogOpen(false);
  };

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
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
        <Grid item>
          <Chip
            variant="outlined"
            label={
              gameStatus() === "waiting"
                ? "Waiting to start..."
                : gameStatus() === "myTurn"
                ? "Your turn"
                : players[gameData.currentPlayer - 1] + "'s turn"
            }
            className={classes.turnIndicator + " " + classes[gameStatus()]}
          />
        </Grid>
      </Grid>
      <Grid id="rack" container xs={12} justify="center" className={classes.rack}>
        {rackStringToArray(racks[props.thisPlayer - 1])
          .filter((letter) => letter !== "") // Don't show "empty" tiles
          .map((letter, index) => {
            return (
              <Tile
                key={index}
                selected={rackSelectedIndices.has(index)}
                onClick={() => toggleLetterSelected(index)}
                letter={letter === "_" ? " " : letter} // Display blanks correctly
              />
            );
          })}
      </Grid>
      <Grid id="info" container direction="column" alignItems="center">
        <div>
          {racks[props.thisPlayer - 1] !== "" && gameData.currentPlayer === 0 ? (
            <Grid item>
              <Typography variant="body2" color="textPrimary">
                <em>Waiting for these players to draw tiles:</em>
              </Typography>
              <List color="textSecondary">
                {racks.map((r, index) => {
                  if (r === "")
                    return (
                      <ListItem style={{ padding: 0 }}>
                        <ListItemIcon>
                          <ChevronRightIcon />
                        </ListItemIcon>
                        <ListItemText secondary={players[index]} />
                      </ListItem>
                    );
                  else return "";
                })}
              </List>
              <Divider style={{ marginBottom: 20 }} />
            </Grid>
          ) : (
            <Button
              variant="contained"
              disabled={!canUpdate}
              color="primary"
              fullWidth="false"
              style={{ marginBottom: 30 }}
              onClick={() => getNewTiles("")}
            >
              {racks[props.thisPlayer - 1] === "" && gameData.currentPlayer === 0
                ? "Get tiles from bag"
                : "Get new tiles from bag"}
            </Button>
          )}
          <Button disabled={!canUpdate} onClick={swapTiles}>
            Swap tiles
          </Button>
        </div>
        <Chip
          label={(gameData.tileBag !== undefined ? gameData.tileBag.length : "") + " tiles left in bag"}
          color="primary"
          style={{ marginBottom: 30 }}
          variant="outlined"
        />
        <Card id="player-box">
          <CardContent style={{ padding: 0 }}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon fontSize="large" color="primary" />
                </ListItemIcon>
                <Typography variant="button" color="primary" style={{ fontSize: "1.2em" }}>
                  Players
                </Typography>
              </ListItem>
              <Divider />
              {players.map((player, i) => {
                return (
                  <ListItem key={i} style={{ paddingLeft: 5 }}>
                    <ChevronRightIcon style={{ opacity: i === gameData.currentPlayer ? 1 : 0 }} />
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      style={{ fontWeight: i === gameData.currentPlayer ? "bold" : "normal" }}
                    >
                      Player {i + 1}: {player}
                    </Typography>
                  </ListItem>
                );
              })}
            </List>
          </CardContent>
        </Card>
      </Grid>
      <Modal open={dialogOpen} handleClose={handleClose} players={players} gameId={props.gameId} />
      {/* <Snackbar></Snackbar> */}
    </Container>
  );
};

const Tile = (props) => {
  const classes = useStyles();
  return (
    <Card
      onClick={props.onClick}
      className={classes.tile + " " + (props.selected ? classes.selectedTile : "")}
      style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <CardActionArea>
        <CardContent style={{ padding: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Typography variant="h4" style={{ fontSize: "2rem" }}>
            {props.letter}
          </Typography>
        </CardContent>
        {/* <Typography variant="body2" style={{ fontSize: "1rem" }}>
          {tilePointValues[props.letter]}
        </Typography> */}
      </CardActionArea>
    </Card>
  );
};
