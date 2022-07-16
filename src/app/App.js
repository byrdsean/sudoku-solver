import "./App.css";
import puzzles from "../api/puzzles.json";
import { useEffect, useState } from "react";

function App() {
  const minimumValue = 1;
  const maximumValue = 9;
  const squareSize = 3;
  const uniqueValues = new Set();
  const [puzzleBoard, setPuzzleBoard] = useState([]);

  const startSolver = () => {};

  //For a given row and col coordinate, validate the 3x3 square
  const isValidSquare = (row, col) => {
    uniqueValues.clear();

    //Find the coordinate for the first square in the box
    let firstRow = Math.floor(row / squareSize) * squareSize;
    let firstColumn = Math.floor(col / squareSize) * squareSize;

    //Loop through the items in the square, and validate
    for (let r = firstRow; r < firstRow + squareSize; r++) {
      for (let c = firstColumn; c < firstColumn + squareSize; c++) {
        let value = puzzleBoard[r][c];
        if (isValidValue(value)) {
          if (!uniqueValues.has(value)) {
            uniqueValues.add(value);
          } else {
            return false;
          }
        }
      }
    }
    return true;
  };

  //Loop through the specified row index, and determine if it is currently valid
  const isValidRow = (row) => {
    uniqueValues.clear();
    puzzleBoard[row].forEach((value) => {
      if (isValidValue(value)) {
        if (!uniqueValues.has(value)) {
          uniqueValues.add(value);
        } else {
          return false;
        }
      }
    });
    return true;
  };

  //Loop through the specified column index, and determine if it is currently valid
  const isValidColumn = (column) => {
    uniqueValues.clear();
    for (let i = 0; i < puzzleBoard.length; i++) {
      let value = puzzleBoard[i][column];
      if (isValidValue(value)) {
        if (!uniqueValues.has(value)) {
          uniqueValues.add(value);
        } else {
          return false;
        }
      }
    }
    return true;
  };

  const isValidValue = (value) => {
    return minimumValue <= value && value <= maximumValue;
  };

  useEffect(() => {
    //Store the puzzle to solve into state
    setPuzzleBoard(puzzles.easy[0]);
  }, []);

  return (
    <div id="gameBody">
      <div id="gameboard">
        {puzzleBoard.map((r, i) => {
          return (
            <div className="row" key={`row-${i}`}>
              {r.map((c, x) => {
                return (
                  <div
                    className={`col ${c !== 0 ? "orig" : ""}`}
                    key={`col-${i}-${x}`}
                  >
                    {c !== 0 ? c : ""}
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
