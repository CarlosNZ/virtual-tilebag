import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import { NewGame } from "./components/NewGame";
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
          <Route exact path="/game/id-:gameID/p:player" component={Game} />
        </Router>
        <Footer />
      </ThemeProvider>
    </section>
  );
}

function Home() {
  return <NewGame />;
}

function Footer() {
  return (
    <footer style={{ marginTop: 30 }}>
      <Typography variant="caption" display="block" color="textSecondary" align="center" style={{ fontSize: "0.8em" }}>
        {"Copyright © "}
        <Link color="inherit" href="">
          Carl Smith
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    </footer>
  );
}

export default App;
