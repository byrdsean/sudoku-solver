import "./App.css";
import { useEffect, useState } from "react";
import { puzzleConsts as puzzleVals } from "../utils/Constants";
import { expandBoard, flattenBoard } from "../utils/BoardUtilities";
import {
  isValidSquare,
  isValidRow,
  isValidColumn,
  isValidValue,
} from "../utils/ValidationUtilities";
import { setDisplayValue, setBoardItemClass } from "../utils/DisplayUtilities";
import { sleep } from "../utils/TimeUtilities";
import { getAvailablePuzzles, getPuzzle } from "../utils/PuzzleUtilities";
import Controls from "../components/controls/controls";

function App() {
  const randomId = "random";

  //Flatten puzzle board
  const [puzzleBoard, setPuzzleBoard] = useState([]);

  //List of possible puzzles options
  const [puzzleOptions, setPuzzleOptions] = useState([]);

  //Flag to know if the solver started
  const [started, setStarted] = useState(false);

  //Set the current puzzle value
  const [currentPuzzleValue, setCurrentPuzzleValue] = useState("");

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

  const selectPuzzle = (value) => {
    if (value) {
      setPuzzleBoard(flattenBoard(getPuzzle(value)));
      setCurrentPuzzleValue(value);
    }
  };

  const startSolver = async () => {
    if (started) return;

    //Turn the "started" flag on
    setStarted(true);
  };

  const resetPuzzle = () => {
    selectPuzzle(currentPuzzleValue);
    setStarted(false);
  };

  useEffect(() => {
    const solve = async () => {
      //Keep looping until we reach end of board
      let index = 0;
      let resetPreviousValid = false;
      while (started) {
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
        if (puzzleVals.maximumValue < value) {
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
          let row = Math.floor(index / puzzleVals.maximumValue);
          let column = index - row * puzzleVals.maximumValue;
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

      //Turn the "started" flag off
      setStarted(false);
    };

    //Solve the puzzle
    solve();
  }, [started]);

  useEffect(() => {
    if (puzzleOptions && 0 < puzzleOptions.length) {
      selectPuzzle(randomId);
    }
  }, [puzzleOptions]);

  useEffect(() => {
    //Load the available puzzles
    setPuzzleOptions(getAvailablePuzzles());
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
      <Controls
        startSolver={startSolver}
        resetPuzzle={resetPuzzle}
        selectPuzzle={selectPuzzle}
        randomId={randomId}
        puzzleOptions={puzzleOptions}
        started={started}
      />
    </div>
  );
}

export default App;
