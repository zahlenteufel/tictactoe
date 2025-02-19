import { useState } from "react";
import Game from "./Game";
import { v4 as uuidv4 } from "uuid";
import { apiUrl, connectPollInterval } from "./constants";

interface WaitingRoomProps {
  initGame: (game: Game) => void;
}

function WaitingRoom({ initGame }: WaitingRoomProps) {
  const [username, setUsername] = useState<string>(
    `user${uuidv4().slice(0, 4)}`
  );
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);

    const intervalId = setInterval(() => {
      fetch(`${apiUrl}/match?id=${username}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.game_id != null) {
            initGame({ id: data.game_id, username: username });
            clearInterval(intervalId);
            setIsConnecting(false);
            console.log("Match found!");
          } else {
            console.log("No match found");
          }
        })
        .catch((error) => {
          console.error(error);
          // We'll be retrying anyway.
        });
    }, connectPollInterval);
  };

  return (
    <div>
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isConnecting}
        />
      </label>
      <button onClick={handleConnect} disabled={isConnecting}>
        {isConnecting ? "Connecting..." : "Connect to a room"}
      </button>
    </div>
  );
}

export default WaitingRoom;
