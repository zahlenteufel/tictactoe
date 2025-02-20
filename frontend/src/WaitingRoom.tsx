import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { apiUrl, connectPollInterval } from "./constants";
import { useNavigate } from "react-router-dom";

function WaitingRoom() {
  const navigate = useNavigate();
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
            console.log(data);
            clearInterval(intervalId);
            setIsConnecting(false);
            console.log("Match found!");
            navigate(`/game/${data.game_id}?username=${username}`);
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
