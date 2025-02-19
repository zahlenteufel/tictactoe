import { useEffect, useState } from "react";
import "./App.css";
import _ from "lodash";
import WaitingRoom from "./WaitingRoom";
import { pollInterval, apiUrl } from "./constants";
import Game from "./Game";

interface Model {
  board: string[][];
  is_finished: boolean;
}

interface BoardProps {
  model: Model | null;
  game_id: string;
  username: string;
  setError: (error: string | null) => void;
}

const makeMove = async (
  row: number,
  column: number,
  username: string,
  game_id: string,
  setError: (error: string | null) => void
): Promise<boolean> => {
  const rawResponse = await fetch(`${apiUrl}/game/${game_id}/board`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      row: row + 1,
      column: column + 1,
      username: username,
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

function Board({ model, setError, username, game_id }: BoardProps) {
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
                await makeMove(row, column, username, game_id, setError);
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

interface GameInCourseProps {
  game_id: string;
  username: string;
}

function GameInCourse({ game_id, username }: GameInCourseProps) {
  const [data, setData] = useState<Model | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${apiUrl}/game/${game_id}`);
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
  }, [data, error, game_id, setData, setError]);

  return (
    <>
      <h1>TicTacToe</h1>
      <div className="card">
        {error && <div className="error">{error}</div>}
        <Board
          model={data}
          setError={setError}
          game_id={game_id}
          username={username}
        ></Board>
      </div>
    </>
  );
}

function App() {
  const [game, setGame] = useState<Game | null>(null);

  if (game === null) {
    return <WaitingRoom initGame={setGame} />;
  } else {
    return <GameInCourse game_id={game.id} username={game.username} />;
  }
}

export default App;
