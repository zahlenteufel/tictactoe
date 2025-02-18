import { createContext, useState } from "react";

interface PlayerContext {
  player: string;
  error: string | null;
  togglePlayer: () => void;
}

const PlayerContext = createContext<PlayerContext | null>(null);

const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [player, setPlayer] = useState("X");
  const [error, setError] = useState<string | null>(null);

  const togglePlayer = () => {
    setPlayer(player === "X" ? "O" : "X");
  };

  return (
    <PlayerContext.Provider value={{ player, error, togglePlayer }}>
      {children}
    </PlayerContext.Provider>
  );
};

export { PlayerProvider, PlayerContext };
