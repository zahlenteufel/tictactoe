import { useEffect, useState } from "react";
import _ from "lodash";
import { pollInterval, apiUrl } from "./constants";
import { Model, Board } from "./Board";
import { useParams, useLocation } from "react-router-dom";

function GameInCourse() {
  const { game_id } = useParams();
  const { search } = useLocation();
  const username = new URLSearchParams(search).get("username");
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
          game_id={game_id!}
          username={username!}
        ></Board>
      </div>
    </>
  );
}

export { GameInCourse };
