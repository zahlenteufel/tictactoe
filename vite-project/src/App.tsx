/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useEffect, useState } from "react";
import "./App.css";
import _ from "lodash";
import { PlayerProvider, PlayerContext } from "./PlayerContext";
import WaitingRoom from "./WaitingRoom";
import { pollInterval, apiUrl } from "./constants";
import Game from "./Game";

interface Model {
  board: string[][];
  is_finished: boolean;
}

interface BoardProps {
  model: Model | null;
  setError: (error: string | null) => void;
}

const makeMove = async (
  row: number,
  column: number,
  player: string,
  setError: (error: string | null) => void
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
    const err = JSON.parse(await rawResponse.text())["error"] as string;
    console.error(err);
    setError(err);
    return false;
  }
  setError(null);
  return true;
};

function Board({ model, setError }: BoardProps) {
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
                if (await makeMove(row, column, player, setError))
                  togglePlayer();
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

function GameInCourse() {
  const [data, setData] = useState<Model | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(apiUrl + "/board");
      if (!response.ok) {
        const error = await response.text();
        console.log(error);
        setData(null);
        return;
      }
      const json = await response.json();
      if (!_.isEqual(json, data)) {
        setData(json);
        console.log("Set data: ", json);
      }
    };
    const intervalId = setInterval(fetchData, pollInterval);
    return () => clearInterval(intervalId); // Cleanup interval on component unmount.
  }, [data, error, setData, setError]);

  return (
    <>
      <h1>TicTacToe</h1>
      <div className="card">
        <PlayerProvider>
          {error && <div className="error">{error}</div>}
          <Board model={data} setError={setError}></Board>
          <PlayerInfo />
        </PlayerProvider>
      </div>
    </>
  );
}

function App() {
  const [game, setGame] = useState<Game | null>(null);

  if (game === null) {
    return <WaitingRoom initGame={setGame} />;
  } else {
    return <GameInCourse />;
  }
}

export default App;
