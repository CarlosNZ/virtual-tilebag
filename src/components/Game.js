import React, { useState, useEffect } from "react";
import logo from "../img/vt_icon.png";
import * as FirestoreDb from "../services/firebase";
import { shuffleBag, drawFromBag, tilePointValues } from "../services/tilebag";
import { makeStyles } from "@material-ui/core/styles";
import PersonIcon from "@material-ui/icons/Person";
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
  infoCard: {
    margin: theme.spacing(1),
  },
  myTurn: {
    borderColor: "#hsla(115, 39%, 53%, 1)",
    backgroundColor: "hsla(115, 39%, 53%, 0.15)",
  },
  othersTurn: {
    borderColor: "hsla(38, 100%, 50%, 1.00)",
    backgroundColor: "hsla(38, 100%, 50%, 0.15)",
  },
  waiting: {
    borderColor: "hsla(8, 90%, 58%, 1.00)",
    backgroundColor: "hsla(8, 90%, 58%, 0.15)",
  },
  rack: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  tile: {
    width: 40,
    height: 40,
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

  // Listener for changes to database -> update local state
  useEffect(() => {
    const unsubscribe = FirestoreDb.syncGameState(props.gameId, (doc) => {
      setGameData({
        currentPlayer: parseInt(doc.data().currentPlayer),
        tilesRemaining: parseInt(doc.data().tilesRemaining),
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

  const getNewTiles = () => {
    const selectedTilesIndices = gameData.currentPlayer === 0 ? [0, 1, 2, 3, 4, 5, 6] : Array.from(rackSelectedIndices);
    const newTiles = drawFromBag(props.tileBag, gameData.tilesRemaining, selectedTilesIndices.length);
    const newTileCount = newTiles.length;
    const newRack = rackStringToArray(racks[props.thisPlayer - 1]);
    // eslint-disable-next-line
    selectedTilesIndices.map(function (i) {
      newRack[i] = newTiles.pop();
    });

    const newRacks = [...racks];
    newRacks[props.thisPlayer - 1] = newRack.join("");
    FirestoreDb.updateState(props.gameId, "racks", newRacks);
    setRackSelectedIndices(new Set());
    console.log("Current player: ", gameData.currentPlayer);
    const newPlayer =
      gameData.currentPlayer === 0 ? gameData.currentPlayer : (gameData.currentPlayer % players.length) + 1;
    console.log("New player: ", newPlayer);
    FirestoreDb.updateState(props.gameId, "currentPlayer", newPlayer);
    FirestoreDb.updateState(props.gameId, "tilesRemaining", gameData.tilesRemaining - newTileCount);
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

  return (
    <Container component="main" maxWidth="sm">
      <Grid id="header" container xs={12} direction="row" justify="space-between" alignItems="center">
        <Grid container direction="row" xs={6} alignItems="center" className={classes.header}>
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
          <Card variant="outlined" className={classes.infoCard + " " + classes[gameStatus()]}>
            <CardContent style={{ padding: 8 }}>
              <Typography variant="body2" align="right">
                {gameStatus() === "waiting"
                  ? "Waiting to start..."
                  : gameStatus() === "myTurn"
                  ? "Your turn"
                  : players[gameData.currentPlayer - 1] + "'s turn"}
              </Typography>
              <Typography variant="body2" align="right" style={{ fontSize: "0.75rem" }}>
                Player {props.thisPlayer}: {players[[props.thisPlayer] - 1]}
              </Typography>
            </CardContent>
          </Card>
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
          <Button
            variant="contained"
            disabled={!canUpdate}
            color="primary"
            fullWidth="false"
            style={{ marginBottom: 30 }}
            onClick={getNewTiles}
          >
            Get new tiles from bag
          </Button>
        </div>
        <Chip label={gameData.tilesRemaining + " tiles left in bag"} style={{ marginBottom: 30 }} variant="outlined" />
        <Card id="player-box" style={{ padding: 15, paddingBottom: 0, backgroundColor: "GhostWhite" }}>
          <CardContent>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom="true" style={{ marginLeft: 10 }}>
              This game:
            </Typography>
            <Divider style={{ marginBottom: 10 }} />
            {players.map((player, i) => {
              return (
                <Grid container alignItems="flex-end" style={{ marginTop: 20 }}>
                  <PersonIcon style={{ marginLeft: -20 }} />
                  <Typography
                    variant="body2"
                    color="textPrimary"
                    style={{ marginLeft: 10, fontWeight: props.thisPlayer === i + 1 ? "bold" : "normal" }}
                  >
                    Player {i + 1}: {player}
                  </Typography>
                </Grid>
              );
            })}
          </CardContent>
        </Card>
      </Grid>
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
