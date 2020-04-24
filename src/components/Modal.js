import React from "react";
import { Button, Typography, List, ListItem, Dialog, DialogTitle, DialogContent, Divider } from "@material-ui/core";

export const Modal = (props) => {
  const { open, handleClose, players, gameId } = props;

  const urls = players.map((player, index) => {
    return "https://virtual-tilebag.web.app/game/id-" + gameId + "/p" + (index + 1);
  });

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle align="center">Virtual Tilebag</DialogTitle>
      <Divider variant="middle" />
      <DialogContent>
        <Typography color="textSecondary">
          Share these links with other players so they can load their version of the game.
        </Typography>
        <List>
          {players.map((player, index) => {
            return (
              <>
                <ListItem key={index} style={{ flexDirection: "column", alignItems: "flex-start" }}>
                  <Typography>
                    Player {index + 1}: {player}
                  </Typography>
                  <Typography variant="body2" styles={{ fontSize: "0.5em" }}>
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
