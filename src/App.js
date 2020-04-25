import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import { NewGame } from "./components/NewGame";
import { About } from "./components/About";
import { Home } from "./components/Home";
import { Game } from "./components/Game";
import { Typography, Link, ThemeProvider } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#1f225e",
    },
  },
});

function App() {
  return (
    <section className="App">
      <ThemeProvider theme={theme}>
        <Router>
          <Route exact path="/" component={Home} />
          <Route exact path="/new-game" component={NewGame} />
          <Route exact path="/about" component={About} />
          <Route exact path="/game/id-:gameID/p:player" component={Game} />
        </Router>
        <Footer />
      </ThemeProvider>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ marginTop: 30, marginBottom: 30 }}>
      <Typography variant="caption" display="block" color="textSecondary" align="center" style={{ fontSize: "0.8em" }}>
        Copyright © Carl Smith {new Date().getFullYear()} &#8226;{" "}
        <Link color="inherit" href="https://forms.gle/L8qCVg6z8isC4kYU6" target="_blank">
          Feedback
        </Link>{" "}
        &#8226;{" "}
        <Link color="inherit" href="https://github.com/CarlosNZ/virtual-tilebag" target="_blank">
          Github
        </Link>
      </Typography>
    </footer>
  );
}

export default App;
