/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useEffect, useState } from "react";
import "./App.css";
import _ from "lodash";
import { PlayerProvider, PlayerContext } from "./PlayerContext";

const pollInterval = 1000;
const apiUrl = "http://localhost:5000";

interface Model {
  board: string[][];
  is_finished: boolean;
}

interface BoardProps {
  model: Model | null;
}

const makeMove = async (
  row: number,
  column: number,
  player: string
): Promise<boolean> => {
  const rawResponse = await fetch(apiUrl + "/board", {
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
    return false;
  }
  return true;
};

function Board({ model }: BoardProps) {
  const { player, togglePlayer } = useContext(PlayerContext)!;
  if (model == null || model == undefined) return <div>Loading...</div>;
  console.log("update model", model);
  return (
    <div>
      <div className="board">
        {Array.from({ length: 9 }, (_, key) => {
          const row = ~~(key / 3);
          const column = ~~(key % 3);
          return (
            <div
              key={key}
              onClick={async () => {
                if (await makeMove(row, column, player)) togglePlayer();
              }}
            >
              {model.board[row][column]}
            </div>
          );
        })}
      </div>
      <div> Finished: {model.is_finished ? "true" : "false"}</div>
    </div>
  );
}

function PlayerInfo() {
  const { player, togglePlayer } = useContext(PlayerContext)!;

  return (
    <div>
      <button onClick={togglePlayer}>Player is {player}</button>
    </div>
  );
}

function App() {
  const [data, setData] = useState<Model | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(apiUrl + "/board");
      if (!response.ok) {
        const error = await response.text();
        setData(null);
        setError(error === "" ? "some error ocurred" : error);
        return;
      }
      const json = await response.json();
      if (!_.isEqual(json, data)) {
        setData(json);
        console.log("Set data: ", json);
      }
      setError(null);
    };
    const intervalId = setInterval(fetchData, pollInterval);
    return () => clearInterval(intervalId); // Cleanup interval on component unmount.
  }, [data, error, setData, setError]);

  return (
    <>
      <h1>TicTacToe</h1>
      <div className="card">
        <PlayerProvider>
          {error && <div className="error">Error!</div>}
          <Board model={data}></Board>
          <PlayerInfo />
        </PlayerProvider>
      </div>
    </>
  );
}

export default App;
