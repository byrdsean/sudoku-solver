import "./App.css";
import puzzles from "../api/puzzles.json";

function App() {
  return (
    <div id="gameBody">
      <div id="gameboard">
        {puzzles.easy[0].map((r) => {
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
        <button>Start</button>
        <button>Reset</button>
      </div>
    </div>
  );
}

export default App;
