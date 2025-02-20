import { apiUrl } from "./constants";

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
) => {
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
  if (rawResponse.ok) {
    setError(null);
    return;
  }
  const err = JSON.parse(await rawResponse.text())["error"] as string;
  console.error(err);
  setError(err);
  return;
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

export { Board, type Model };
