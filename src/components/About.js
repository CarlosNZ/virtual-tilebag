import React from "react";
import { Header } from "./Header";
import button_img from "../img/get_tiles_button.png";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Container, CssBaseline, Paper, Divider, Link, Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(3),
  },
  header: {
    margin: theme.spacing(1),
  },
}));

export const About = (props) => {
  const classes = useStyles();

  return (
    <Container component="main" style={{ maxWidth: 848 }}>
      <CssBaseline />
      <Header />
      <Paper id="about-page" className={classes.paper}>
        <Typography variant="h4" textA>
          About
        </Typography>
        <Divider />
        <h2>What is it?</h2>
        <p>
          Let’s start with what it’s not:{" "}
          <Link underline="always" className={classes.link} target="_blank" href="https://isc.ro/index.php">
            <em>Online Scrabble</em>
          </Link>
          . This is simply an online tool for people who want to play a game of physical Scrabble, in real-time, with
          other humans, but, for whatever reason (such as a global pandemic) are physically isolated from each other.
          Basically, it’s a shared, virtual tile bag, which stays in sync via the magic of the Internet. You provide the
          rest.
        </p>
        <h2>Why?</h2>
        <p>
          This project was inspired by Maths educator and YouTube legend, <strong>Matt Parker</strong>’s valiant attempt
          to solve the problem of{" "}
          <Link
            underline="always"
            className={classes.link}
            target="_blank"
            href="https://www.think-maths.co.uk/scrabble-puzzle"
          >
            how to play Scrabble over a video call
          </Link>
          . His solution, while theoretically solid, seemed to be a bit impractical to actually do every time you want
          to play a game, not to mention error-prone (see video, lol). Hence the <strong>virtual tilebag</strong> was
          born.
        </p>
        <div class="video-responsive">
          {" "}
          <iframe
            title="Matt Parker Scrabble video"
            width="560"
            height="315"
            src="https://www.youtube.com/embed/JaXo_i3ktwM"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
        <h2>How?</h2>
        <p>
          You interact with each other over video chat, just like in Matt’s video. You each have your own Scrabble set,
          and you&#39;re both building the same game on your own board.
        </p>
        <p>
          But, instead of Matt’s complicated shuffling procedure, you just use this app to tell you what your tiles
          should be at every stage of the game.
        </p>
        <p>
          To set up, I’d recommend you lay all your tiles out <em>face up</em> for easy access.
        </p>
        <p>
          Fire up a{" "}
          <Link underline="always" className={classes.link} href="/new-game">
            new game
          </Link>
          , enter in your player info and off you go. You&#39;ll be given a unique link to share with each player.{" "}
        </p>
        <p>
          Once you’re in, draw your starting tiles with the big, honking button:{" "}
          <img src={button_img} alt="Tiles button" style={{ width: 200, verticalAlign: "middle" }} />
        </p>
        <p>Then load your physical tile rack to match the virtual one on your screen. </p>
        <p>
          Player 1 starts. Once you&#39;ve played your move IRL, select the played tiles on the screen, re-draw (press
          the button), and populate your rack accordingly. The other players will need to place your move down on their
          own boards so it&#39;ll help if you can see each other&#39;s games.
        </p>
        <p>
          The next player's interface will then update so they can play their turn, then the next player, et cetera
          until the bag is empty.
        </p>

        <p>
          And yes, you can <em>swap</em> tiles — you know, that thing you do occasionally when your game is going{" "}
          <em>really</em> badly and you’d rather waste a turn trying to get better tiles than play the garbage you have
          in your rack? The “Swap” button is hidden away in the “More Options” menu, since it’s not something you should
          need very often. (It’ll only show up when it’s your turn and you’ve got some tiles selected.)
        </p>

        <p>
          And that&#39;s about it. It should be fairly straightforward once you get going. Please{" "}
          <Link underline="always" className={classes.link} href="https://forms.gle/L8qCVg6z8isC4kYU6" target="_blank">
            send any feedback my way
          </Link>{" "}
          and I&#39;ll try to keep improving it.
        </p>

        <div style={{ display: "flex", justifyContent: "center", padding: 30 }}>
          <Button variant="contained" color="primary" style={{ textAlign: "center" }}>
            <Link href="/new-game" color="inherit" underline="none">
              Play Now
            </Link>
          </Button>
        </div>

        <h2> FAQ</h2>
        <p>
          <b>
            <em>Something’s not working properly. Your app messed up.</em>
          </b>{" "}
          😡
        </p>
        <p>
          Sorry 🤷‍♂️. It’s a work in progress and is likely to have bugs. I welcome any feedback (positive or negative) to
          help improve it.
        </p>
        <p>
          <b>
            <em>Oops, I messed up and entered the wrong tiles! Can I fix it? </em>{" "}
          </b>{" "}
          😬
        </p>
        <p>
          Not yet. I plan to add full history/undo functionality, but it’s not there yet. You have a couple of possible
          escape hatches, though. If you just didn’t enter <em>enough</em> tiles, you can ask the other player(s) to
          just play a “dummy” turn where they click the ‘New Tiles’ button with nothing selected and bring it round to
          you again where you can add the extra tile. Otherwise you’ll need to just have a “house rule” for how to
          handle the situation when a player’s rack doesn’t accurately reflect what’s on their screen. Maybe some kind
          of penalty? Up to you.
        </p>
        <p>
          <b>
            <em>
              Player 1 always starts? But what if we want to draw to see who starts after we’ve already loaded the game
              and drawn tiles?
            </em>
          </b>
        </p>
        <p>
          I know, right? Yes, this will be something I improve in the future. For now, what you can do is just get
          players numbered lower than your preferred starting player to make a “dummy” move (i.e. click ‘New Tiles’ with
          nothing selected) on their first move.
        </p>
        <p>
          <b>
            <em>
              Hang on, those urls are all basically the same with just the player number changed. Can&#39;t someone
              cheat and look at another player&#39;s link?
            </em>
          </b>
        </p>
        <p>
          Sure, but when you play in person you can sneak a peek at their tiles when they’re making a cup of tea. If you
          wanna cheat, you can cheat. My recommendation is to play board games with people you like and trust — whether
          in person or remotely.
        </p>
        <p>
          <b>
            <em>Why put all the tiles face UP? Won’t that make it easy to see what’s still out there?</em>
          </b>
        </p>
        <p>
          Well, yes, but you can deduce this in Scrabble normally anyway, it just takes a little more mental effort. You
          can see the letter distribution of all the tiles on the edge of the board throughout the game, so any thing
          not in your rack or on the board already is either still in the bag or in the other players’ racks. Same thing
          here. If it really bothers you, mix two or three sets of letters together in one big bag — that’ll make it a
          lot harder to tell if the unplayed letters you’re seeing are in the game or not. But that’s pretty hardcore.
        </p>
        <p>
          <b>
            <em>Et une version française?</em>
          </b>
        </p>
        <p>
          Bien sûr, bonne idée. S&#39;il y a suffisamment d&#39;intérêt, j&#39;ajouterai volontiers le français ou toute
          autre langue.<em></em>
        </p>
      </Paper>
    </Container>
  );
};
