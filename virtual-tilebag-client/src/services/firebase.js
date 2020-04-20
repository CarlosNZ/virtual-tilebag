// src/firebase.js

// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

// Add the Firebase products that you want to use
import "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzh-yrd5G5m_8PutEzvJ-eMqLgAmAJG_s",
  authDomain: "virtual-tilebag.firebaseapp.com",
  databaseURL: "https://virtual-tilebag.firebaseio.com",
  projectId: "virtual-tilebag",
  storageBucket: "virtual-tilebag.appspot.com",
  messagingSenderId: "261821605094",
  appId: "1:261821605094:web:6dcbfb62c68c1f5c86c727",
  measurementId: "G-KCGZB8GRX5",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();

export const createGame = (players) => {
  return db.collection("games").add({
    startTime: firebase.firestore.FieldValue.serverTimestamp(),
    hasGameStarted: false,
    currentPlayer: 1,
    players: players,
    racks: players.map((p) => ""),
    tilesRemaining: 100,
  });
};

export const getGame = (gameId) => {
  return db.collection("games").doc(gameId).get();
};

export const updateGame = (gameId, thisPlayer, gameData, rack, allRacks, hasGameStarted) => {
  console.log("Updating database...");
  if (gameData.currentPlayer && allRacks.length > 0) {
    const racks = [...allRacks];
    racks[thisPlayer - 1] = rack.join("");
    return db.collection("games").doc(gameId).update({
      currentPlayer: gameData.currentPlayer,
      tilesRemaining: gameData.tilesRemaining,
      racks: racks,
      hasGameStarted: hasGameStarted,
    });
    // return db.collection("games").doc(gameId).update(gameData);
  }
};

export const syncGameState = (gameId, doc) => {
  console.log("syncing...");
  return db.collection("games").doc(gameId).onSnapshot(doc);
};
