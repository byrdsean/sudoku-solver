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
  const [insertAnswerIndex, setInsertAnswerIndex] = useState(0);

  //Handle for setInterval
  const [loopHandle, setLoopHandle] = useState(0);

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

  const isValidRow = (rowIndex) => {
    uniqueValues.clear();

    if (!puzzleBoard || puzzleBoard.length <= 0 || maximumValue <= rowIndex)
      return false;

    let items = puzzleBoard.slice(
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

  const isValidColumn = (columnIndex) => {
    uniqueValues.clear();

    if (!puzzleBoard || puzzleBoard.length <= 0 || maximumValue <= columnIndex)
      return false;

    let items = [];
    for (let r = 0; r < maximumValue; r++) {
      items = [...items, puzzleBoard[r * maximumValue + columnIndex]];
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

  const insertNextAnswer = () => {
    let handle = setInterval(() => {
      //Increment the index. The useEffect callback will handle updating the board
      setInsertAnswerIndex((insertAnswerIndex) => insertAnswerIndex + 1);
    }, 125);
    setLoopHandle((loopHandle) => loopHandle + handle);
  };

  useEffect(() => {
    let index = insertAnswerIndex - 1;
    if (0 <= index && index < puzzleBoard.length) {
      let value = puzzleBoard[index];
      if (!isValidValue(value)) {
        //Insert a random number for now
        let answer = Math.ceil(Math.random() * (maximumValue - 1));

        setPuzzleBoard((puzzleBoard) => {
          let newBoard = [...puzzleBoard];
          newBoard[index] = answer;
          return newBoard;
        });
      }
    }

    if (maximumValue * maximumValue <= index) {
      console.log("clearInterval");
      clearInterval(loopHandle);
    }
  }, [insertAnswerIndex]);

  useEffect(() => {
    if (started) {
      insertNextAnswer();
    }
    return () => clearInterval(loopHandle);
  }, [started]);

  // useEffect(() => {
  //   console.log({ validColumn: isValidSquare(4,5) });
  // }, [puzzleBoard]);

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
      </div>
    </div>
  );
}

export default App;
