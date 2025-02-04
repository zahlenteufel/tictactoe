import { useEffect, useState } from "react";
import "./App.css";

const pollInterval = 1000;

interface Model {
  board: any;
  is_finished: boolean;
}

interface BoardProps {
  model: Model | null;
}

function Board({ model }: BoardProps) {
  if (model == null || model == undefined) return <div>Loading...</div>;
  console.log("update model", model);
  return (
    <div className="board">
      {Array.from({ length: 9 }, (_, key) => {
        const row = ~~(key / 3);
        const column = ~~(key % 3);
        return <div key={key}>{model.board[row][column]}</div>;
      })}
    </div>
  );
}

function App() {
  const [player, setPlayer] = useState("X");
  const [data, setData] = useState<Model | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      fetch("/api/board")
        .then((response) => {
          response.json().then((d) => {
            if (response.ok) {
              if (JSON.stringify(d) != JSON.stringify(data)) {
                setData(d);
                console.log("Set data: ", d);
              }
              setError(null);
            } else {
              setData(null);
              console.log("Set data: ERROR");
              setError(d);
            }
          });
        })
        .catch((err) => {
          setData(null);
          console.log("there was ERROR");
          setError(err + "");
        });
    };
    const intervalId = setInterval(fetchData, pollInterval);
    return () => clearInterval(intervalId); // Cleanup interval on component unmount.
  }, [data]);

  return (
    <>
      <h1>TicTacToe</h1>
      <div className="card">
        {error && <div className="error">Error!</div>}
        <Board model={data}></Board>
        <button onClick={() => setPlayer((p) => (p == "X" ? "O" : "X"))}>
          Player is {player}
        </button>
      </div>
    </>
  );
}

export default App;
