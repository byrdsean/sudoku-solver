import { puzzleConsts as puzzleVals } from "./Constants";

const uniqueValues = new Set();

//For a given row and col coordinate, validate the 3x3 square
export const isValidSquare = (row, col, board) => {
  uniqueValues.clear();

  //Find the coordinate for the first square in the box
  let firstRow =
    Math.floor(row / puzzleVals.squareSize) * puzzleVals.squareSize;
  let firstColumn =
    Math.floor(col / puzzleVals.squareSize) * puzzleVals.squareSize;

  //Loop through the items in the square, and validate
  for (let ri = 0; ri < puzzleVals.squareSize; ri++) {
    for (let ci = 0; ci < puzzleVals.squareSize; ci++) {
      //Calculate the index to check
      let index =
        (firstRow + ri) * puzzleVals.squareSize * puzzleVals.squareSize +
        firstColumn +
        ci;
      let aItem = board[index];

      //validate the value
      if (isValidValue(aItem.value)) {
        if (!uniqueValues.has(aItem.value)) {
          uniqueValues.add(aItem.value);
        } else {
          return false;
        }
      }
    }
  }

  return true;
};

export const isValidRow = (rowIndex, board) => {
  uniqueValues.clear();
  if (!board || board.length <= 0 || puzzleVals.maximumValue <= rowIndex)
    return false;

  let items = board.slice(
    rowIndex * puzzleVals.maximumValue,
    rowIndex * puzzleVals.maximumValue + puzzleVals.maximumValue
  );

  let flag = true;
  items.forEach((aItem) => {
    if (isValidValue(aItem.value)) {
      if (!uniqueValues.has(aItem.value)) {
        uniqueValues.add(aItem.value);
      } else {
        flag = false;
      }
    }
  });
  return flag;
};

export const isValidColumn = (columnIndex, board) => {
  uniqueValues.clear();

  if (!board || board.length <= 0 || puzzleVals.maximumValue <= columnIndex)
    return false;

  let items = [];
  for (let r = 0; r < puzzleVals.maximumValue; r++) {
    items = [...items, board[r * puzzleVals.maximumValue + columnIndex]];
  }

  let flag = true;
  items.forEach((aItem) => {
    if (isValidValue(aItem.value)) {
      if (!uniqueValues.has(aItem.value)) {
        uniqueValues.add(aItem.value);
      } else {
        flag = false;
      }
    }
  });
  return flag;
};

export const isValidValue = (value) => {
  return puzzleVals.minimumValue <= value && value <= puzzleVals.maximumValue;
};
