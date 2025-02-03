import { useState } from 'react'
import './App.css'

function Board() {
  return (
    <div className="board">
      {Array.from({ length: 9 }, (_, key) => (
        <div key={key}>{key}</div>
      ))}
    </div>
  );
}

function App() {
  const [player, setPlayer] = useState("X")

  return (
    <>
      <h1>TicTacToe</h1>
      <div className="card">
        <Board></Board>
        <button onClick={() => setPlayer((p) => p == "X" ? "O" : "X")}>
          Player is {player}
        </button>
      </div>
    </>
  )
}

export default App
