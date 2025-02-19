import { createContext, useState } from "react";

interface PlayerContext {
  player: string;
  togglePlayer: () => void;
}

const PlayerContext = createContext<PlayerContext | null>(null);

const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [player, setPlayer] = useState("X");

  const togglePlayer = () => {
    setPlayer(player === "X" ? "O" : "X");
  };

  return (
    <PlayerContext.Provider value={{ player, togglePlayer }}>
      {children}
    </PlayerContext.Provider>
  );
};

export { PlayerProvider, PlayerContext };
