import React, { useState, useEffect } from "react";
import logo from "../img/vt_icon.png";
import * as FirestoreDb from "../services/firebase";
import { shuffleBag, drawFromBag, tilePointValues } from "../services/tilebag";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => {});

export const Modal = (props) => {
  const { open, handleClose, players, gameId } = props;

  const urls = players.map((player, index) => {
    return "https://virtual-tilebag.web.app/game/id-" + gameId + "/p" + (index + 1);
  });

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Game starting</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Share these links with other players so they can load their version of the game.
        </DialogContentText>
        <List>
          {players.map((player, index) => {
            return (
              <>
                <ListItem style={{ flexDirection: "column", alignItems: "flex-start" }}>
                  <Typography>
                    Player {index + 1}: {player}
                  </Typography>
                  <Typography variant="body2" styles={{ fontSize: "0.7em" }}>
                    {urls[index]}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => {
                      navigator.clipboard.writeText(urls[index]);
                    }}
                  >
                    Copy
                  </Button>
                </ListItem>
              </>
            );
          })}
        </List>
      </DialogContent>
    </Dialog>
  );
};
