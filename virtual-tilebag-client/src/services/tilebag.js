// import { shuffle } from "knuth-shuffle-seeded"
const shuffle = require("knuth-shuffle-seeded");

// prettier-ignore
const scrabbleEnglish = ["A", "A", "A", "A", "A", "A", "A", "A", "A", "B", "B", "C", "C", "D", "D", "D", "D", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "F", "F", "G", "G", "G", "H", "H", "I", "I", "I", "I", "I", "I", "I", "I", "I", "J", "K", "L", "L", "L", "L", "M", "M", "N", "N", "N", "N", "N", "N", "O", "O", "O", "O", "O", "O", "O", "O", "P", "P", "Q", "R", "R", "R", "R", "R", "R", "S", "S", "S", "S", "T", "T", "T", "T", "T", "T", "U", "U", "U", "U", "V", "V", "W", "W", "X", "Y", "Y", "Z", "_", "_"];

// prettier-ignore
export const tilePointValues = {
  "E": 1,  "A": 1,  "I": 1,  "O": 1, "U": 1,
  "N": 1,  "R": 1,  "T": 1,  "S": 1,  
  "D": 2,  "G": 2,
  "B": 3,  "C": 3,"M": 3, "P": 3,
  "F": 4,"H": 4,"V": 4,"W": 4,"Y": 4,
  "K": 5,
  "J": 8,"X": 8,
  "Q": 10,"Z": 10,
  "_": 0,
}

export const shuffleBag = function (seed) {
  console.log("Shuffling the bag");
  return shuffle(Array.from(scrabbleEnglish), seed);
};

export const drawFromBag = function (tileBag, tilesRemaning, tilesRequested) {
  const startPos = tileBag.length - tilesRemaning;
  const endPos = startPos + tilesRequested;
  return tileBag.slice(startPos, endPos);
};
