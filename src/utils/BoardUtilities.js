import { puzzleConsts as puzzleVals } from "./Constants";

export const flattenBoard = (board) => {
  return board.flat().map((v) => {
    return {
      value: v,
      isOriginal: v !== 0,
    };
  });
};

export const expandBoard = (flat) => {
  //Create the multidimensional array to build the board
  let board = [];
  for (let r = 0; r < puzzleVals.maximumValue; r++) {
    let newRow = flat.slice(
      r * puzzleVals.maximumValue,
      r * puzzleVals.maximumValue + puzzleVals.maximumValue
    );
    board = [...board, newRow];
  }
  return board;
};
