import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import WaitingRoom from "./WaitingRoom";
import { GameInCourse } from "./GameInCourse";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/match" replace />} />
        <Route path="/match" element={<WaitingRoom />} />
        <Route path="/game/:game_id" element={<GameInCourse />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
