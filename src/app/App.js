import "./App.css";
import puzzles from "../api/puzzles.json";
import { useEffect, useState } from "react";

function App() {
  const minimumValue = 1;
  const maximumValue = 9;
  const squareSize = 3;
  const uniqueValues = new Set();

  //Flatten puzzle board
  const [puzzleBoard, setPuzzleBoard] = useState([]);

  //Flag to know if solver has started
  const [started, setStarted] = useState(false);

  //For a given row and col coordinate, validate the 3x3 square
  const isValidSquare = (row, col, board) => {
    uniqueValues.clear();

    //Find the coordinate for the first square in the box
    let firstRow = Math.floor(row / squareSize) * squareSize;
    let firstColumn = Math.floor(col / squareSize) * squareSize;

    //Loop through the items in the square, and validate
    for (let ri = 0; ri < squareSize; ri++) {
      for (let ci = 0; ci < squareSize; ci++) {
        //Calculate the index to check
        let index =
          (firstRow + ri) * squareSize * squareSize + firstColumn + ci;
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

  const isValidRow = (rowIndex, board) => {
    uniqueValues.clear();
    if (!board || board.length <= 0 || maximumValue <= rowIndex) return false;

    let items = board.slice(
      rowIndex * maximumValue,
      rowIndex * maximumValue + maximumValue
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

  const isValidColumn = (columnIndex, board) => {
    uniqueValues.clear();

    if (!board || board.length <= 0 || maximumValue <= columnIndex)
      return false;

    let items = [];
    for (let r = 0; r < maximumValue; r++) {
      items = [...items, board[r * maximumValue + columnIndex]];
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

  const isValidValue = (value) => {
    return minimumValue <= value && value <= maximumValue;
  };

  const flattenBoard = (board) => {
    return board.flat().map((v) => {
      return {
        value: v,
        isOriginal: v !== 0,
      };
    });
  };

  const expandBoard = (flat) => {
    //Create the multidimensional array to build the board
    let board = [];
    for (let r = 0; r < maximumValue; r++) {
      let newRow = flat.slice(
        r * maximumValue,
        r * maximumValue + maximumValue
      );
      board = [...board, newRow];
    }
    return board;
  };

  const setDisplayValue = (item) => {
    if (item.isOriginal) return item.value;
    return minimumValue <= item.value && item.value <= maximumValue
      ? item.value
      : "";
  };

  const setBoardItemClass = (item) => {
    if (item.isOriginal) return "orig";
    if (!item.isOriginal && item.value !== 0) return "answer";
    return "";
  };

  //https://flaviocopes.com/how-to-slow-loop-javascript/
  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  //Create a new board with the updated value
  const setNewValueToBoard = (index, value) => {
    let newBoard = [...puzzleBoard];
    newBoard[index].value = value;
    setPuzzleBoard(newBoard);
  };

  //Set the index to the LAST index that was set
  const findLastSetIndex = (index) => {
    let lastIndex = -1;
    for (let p = index - 1; 0 <= p; p--) {
      if (!puzzleBoard[p].isOriginal) {
        lastIndex = p;
        break;
      }
    }
    return lastIndex;
  };

  const startSolver = async () => {
    //Keep looping until we reach end of board
    let index = 0;
    let resetPreviousValid = false;
    while (true) {
      //Check if the loop should break
      if (puzzleBoard.length <= index) break;

      //Check if the current index contains an original value from the board
      //If so, continue
      if (puzzleBoard[index].isOriginal) {
        index++;
        continue;
      }

      //Get the value of the current index. If the value is invalid, update the board
      let value = puzzleBoard[index].value;
      if (maximumValue < value) {
        //Reset the current value of the board
        setNewValueToBoard(index, 0);

        //Set the index to the LAST index that was set
        index = findLastSetIndex(index);

        //Set the flag to know that we need to update the previous valid value
        resetPreviousValid = true;
      } else if (!isValidValue(value)) {
        setNewValueToBoard(index, value + 1);
      } else {
        //Value is within the valid range. Validate the board
        let row = Math.floor(index / maximumValue);
        let column = index - row * maximumValue;
        let isValid =
          !resetPreviousValid &&
          isValidSquare(row, column, puzzleBoard) &&
          isValidRow(row, puzzleBoard) &&
          isValidColumn(column, puzzleBoard);

        //if the board is valid, then move to the next index.
        //Otherwise, set a new value
        if (isValid) {
          index++;
        } else {
          //Board is invalid. Increment the value and check in the next loop
          setNewValueToBoard(index, value + 1);
          resetPreviousValid = false;
        }
      }

      //Sleep for a few seconds
      await sleep(50);
    }
  };

  useEffect(() => {
    setPuzzleBoard(flattenBoard(puzzles.easy[0]));
  }, []);

  return (
    <div id="gameBody">
      <div id="gameboard">
        {expandBoard(puzzleBoard).map((r, i) => {
          return (
            <div className="row" key={`row-${i}`}>
              {r.map((c, x) => {
                return (
                  <div
                    className={`col ${setBoardItemClass(c)}`.trim()}
                    key={`col-${i}-${x}`}
                  >
                    {setDisplayValue(c)}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <div id="controls">
        <button onClick={startSolver}>Start</button>
        <button>Reset</button>
      </div>
    </div>
  );
}

export default App;
