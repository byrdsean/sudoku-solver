import React from "react";
import "./controls.css";

const Controls = ({
  startSolver,
  selectPuzzle,
  randomId,
  puzzleOptions,
  started,
}) => {
  return (
    <div id="controls">
      <div id="button-controls">
        <button onClick={startSolver} disabled={started}>
          Start
        </button>
        <button>Reset</button>
      </div>
      <div id="selectPuzzle">
        <label>
          <p className="title">Select Puzzle:</p>
          <select
            id="puzzleSelector"
            onChange={(e) => selectPuzzle(e.target.value)}
          >
            <option id={randomId} value={randomId}>
              Random
            </option>
            {puzzleOptions.map((i) => (
              <option id={i.id} key={i.id} value={i.value}>
                {i.text}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
};

export default Controls;
