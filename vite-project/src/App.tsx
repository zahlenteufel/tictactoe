import { useEffect, useState } from "react";
import "./App.css";

const pollInterval = 1000;

interface Model {
  board: any;
  is_finished: boolean;
}

interface BoardProps {
  model: Model | null;
  player: string;
  togglePlayer: any;
}

const click =
  (row: number, column: number, player: string, togglePlayer: any) =>
  async (_) => {
    const rawResponse = await fetch("/api/board", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        row: row + 1,
        column: column + 1,
        player: player,
      }),
    });
    if (!rawResponse.ok) {
      console.error(await rawResponse.text());
    }
    togglePlayer();
  };

function Board({ model, player, togglePlayer }: BoardProps) {
  if (model == null || model == undefined) return <div>Loading...</div>;
  console.log("update model", model);
  return (
    <div>
      <div className="board">
        {Array.from({ length: 9 }, (_, key) => {
          const row = ~~(key / 3);
          const column = ~~(key % 3);
          return (
            <div key={key} onClick={click(row, column, player, togglePlayer)}>
              {model.board[row][column]}
            </div>
          );
        })}
      </div>
      <div> Finished: {model.is_finished ? "true" : "false"}</div>
    </div>
  );
}

function App() {
  const [player, setPlayer] = useState("X");
  const [data, setData] = useState<Model | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/board");
      if (!response.ok) {
        const error = await response.text();
        setData(null);
        setError(error === "" ? "some error ocurred" : error);
        return;
      }
      const json = await response.json();
      if (JSON.stringify(json) != JSON.stringify(data)) {
        setData(json);
        console.log("Set data: ", json);
      }
      setError(null);
    };
    const intervalId = setInterval(fetchData, pollInterval);
    return () => clearInterval(intervalId); // Cleanup interval on component unmount.
  }, [data, error, setData, setError]);

  const togglePlayer = (_) => {
    setPlayer((p) => (p == "X" ? "O" : "X"));
  };

  return (
    <>
      <h1>TicTacToe</h1>
      <div className="card">
        {error && <div className="error">Error!</div>}
        <Board model={data} player={player} togglePlayer={togglePlayer}></Board>
        <button onClick={togglePlayer}>Player is {player}</button>
      </div>
    </>
  );
}

export default App;
