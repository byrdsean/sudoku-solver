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

  //Next index to insert an answer
  const [insertAnswerIndex, setInsertAnswerIndex] = useState(-1);

  //Handle for setInterval
  const [loopHandle, setLoopHandle] = useState(0);

  //Record of all insertions to try and solve puzzle
  const [insertionRecord, setInsertionRecord] = useState([]);

  //Flag to know if the current board is valid
  const [validBoard, setValidBoard] = useState(true);

  const [outputMsg, setOutputMsg] = useState("");

  // //For a given row and col coordinate, validate the 3x3 square
  // const isValidSquare = (row, col) => {
  //   uniqueValues.clear();

  //   //Find the coordinate for the first square in the box
  //   let firstRow = Math.floor(row / squareSize) * squareSize;
  //   let firstColumn = Math.floor(col / squareSize) * squareSize;

  //   //Loop through the items in the square, and validate
  //   for (let r = firstRow; r < firstRow + squareSize; r++) {
  //     for (let c = firstColumn; c < firstColumn + squareSize; c++) {
  //       let value = puzzleBoard[r][c];
  //       if (isValidValue(value)) {
  //         if (!uniqueValues.has(value)) {
  //           uniqueValues.add(value);
  //         } else {
  //           return false;
  //         }
  //       }
  //     }
  //   }
  //   return true;
  // };

  const isValidRow = (rowIndex, board) => {
    uniqueValues.clear();
    if (!board || board.length <= 0 || maximumValue <= rowIndex) return false;

    let items = board.slice(
      rowIndex * maximumValue,
      rowIndex * maximumValue + maximumValue
    );

    let flag = true;
    items.forEach((value) => {
      if (isValidValue(value)) {
        if (!uniqueValues.has(value)) {
          uniqueValues.add(value);
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
    items.forEach((value) => {
      if (isValidValue(value)) {
        if (!uniqueValues.has(value)) {
          uniqueValues.add(value);
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

  const startSolver = () => {
    setStarted(true);
  };

  const flattenBoard = (board) => {
    return board.flat();
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

  const getNextAnswerIndex = (index) => {
    //Get the index for the next item to set
    let newIndex = index + 1;
    console.log({ newIndex, index });

    //Keep looking for the next index to actually set, not one that already has a value
    while (
      0 <= newIndex &&
      newIndex < puzzleBoard.length &&
      puzzleBoard[newIndex] != 0
    ) {
      newIndex++;
    }
    return newIndex;
  };

  const insertNextAnswer = () => {
    let handle = setInterval(() => {
      //Increment the index. The useEffect callback will handle updating the board
      if (validBoard) {
        // setInsertAnswerIndex((insertAnswerIndex) => insertAnswerIndex + 1);
        setInsertAnswerIndex((insertAnswerIndex) =>
          getNextAnswerIndex(insertAnswerIndex)
        );
      }
    }, 1000);

    //Set the handle
    if (0 < handle) {
      setLoopHandle((loopHandle) => loopHandle + handle);
    }
  };

  useEffect(() => {
    if (0 <= insertAnswerIndex && insertAnswerIndex < puzzleBoard.length) {
      let value = puzzleBoard[insertAnswerIndex];
      if (!isValidValue(value)) {
        //Create a new board with the updated value
        let newBoard = [...puzzleBoard];
        newBoard[insertAnswerIndex] = value + 1;

        // Validate the new board
        let row = Math.floor(insertAnswerIndex / maximumValue);
        let column = insertAnswerIndex - row * maximumValue;
        let isValid =
          isValidRow(row, newBoard) && isValidColumn(column, newBoard);
        setValidBoard(isValid);

        //Update the puzzle board
        setPuzzleBoard(newBoard);
      }
    }

    //End the loop if there are no more values to loop through
    if (maximumValue * maximumValue <= insertAnswerIndex) {
      clearInterval(loopHandle);
    }
  }, [insertAnswerIndex]);

  useEffect(() => {
    if (started) {
      insertNextAnswer();
    }
    return () => clearInterval(loopHandle);
  }, [started]);

  useEffect(() => {
    if (0 <= insertAnswerIndex) {
      //Record the index that was just worked on
      setInsertionRecord((insertionRecord) => [
        ...insertionRecord,
        insertAnswerIndex,
      ]);
      setOutputMsg((outputMsg) => `${outputMsg} ${insertAnswerIndex}`);
    }
  }, [puzzleBoard]);

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
        <p>{outputMsg}</p>
      </div>
    </div>
  );
}

export default App;
