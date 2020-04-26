import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import "firebase/firestore";

export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  measurementId: process.env.REACT_APP_FIREBASE_PROJECT_MEASUREMENT_ID,
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();

export const createGame = (players) => {
  return db.collection("games").add({
    startTime: firebase.firestore.FieldValue.serverTimestamp(),
    currentPlayer: 0,
    players: players,
    racks: players.map((p) => ""),
    tileBag: [],
    history: [],
  });
};

export const getGame = (gameId) => {
  return db.collection("games").doc(gameId).get();
};

export const updateState = (gameId, field, newValue) => {
  console.log("Updating database...");
  return db
    .collection("games")
    .doc(gameId)
    .update({
      [field]: newValue,
    });
};

export const syncGameState = (gameId, doc) => {
  console.log("syncing...");
  return db.collection("games").doc(gameId).onSnapshot(doc);
};
