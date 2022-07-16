import "./App.css";
import puzzles from "../api/puzzles.json";
import { useEffect, useState } from "react";

function App() {
  const minimumValue = 1;
  const maximumValue = 9;
  const uniqueValues = new Set();
  const [puzzleBoard, setPuzzleBoard] = useState([]);

  const startSolver = () => {};

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
        {puzzleBoard.map((r) => {
          return (
            <div className="row">
              {r.map((c) => {
                return (
                  <div className={`col ${c !== 0 ? "orig" : ""}`}>
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
