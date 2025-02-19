import { useEffect, useState } from "react";
import "./App.css";
import _ from "lodash";
import WaitingRoom from "./WaitingRoom";
import { pollInterval, apiUrl } from "./constants";
import Game from "./Game";
import { Model, Board } from "./Board";

function GameInCourse({ id, username }: Game) {
  const [data, setData] = useState<Model | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${apiUrl}/game/${id}`);
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
  }, [data, error, id, setData, setError]);

  return (
    <>
      <h1>TicTacToe</h1>
      <div className="card">
        {error && <div className="error">{error}</div>}
        <Board
          model={data}
          setError={setError}
          game_id={id}
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
    return <GameInCourse id={game.id} username={game.username} />;
  }
}

export default App;
