import "./App.css";
import puzzles from "../api/puzzles.json";
import { useEffect, useState } from "react";

function App() {
  const [puzzleBoard, setPuzzleBoard] = useState([]);

  const startSolver = () => {};

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
