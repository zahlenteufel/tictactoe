import { useState } from "react";
import "./App.css";
import WaitingRoom from "./WaitingRoom";
import Game from "./Game";
import { GameInCourse } from "./GameInCourse";

function App() {
  const [game, setGame] = useState<Game | null>(null);

  if (game === null) {
    return <WaitingRoom initGame={setGame} />;
  } else {
    return <GameInCourse id={game.id} username={game.username} />;
  }
}

export default App;
