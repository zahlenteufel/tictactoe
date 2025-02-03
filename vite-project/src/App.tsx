import { useEffect, useState } from 'react'
import './App.css'

const pollInterval = 1000;

function Board(model: any) {
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
  const [data, setData] = useState(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      fetch("/api/board").then(response => {
        response.json().then(d => {
          if (response.ok) {
            setData(d);
            console.log(d);
            setError(null);
          } else {
            setData(null);
            setError(d);
          }
        }
        )
      }).catch(err => {
        setData(null);
        setError(err + '');
      })
    };
    const intervalId = setInterval(fetchData, pollInterval);
    return () => clearInterval(intervalId);  // Cleanup interval on component unmount.
  }, []);

  return (
    <>
      <h1>TicTacToe</h1>
      <div className="card">
        {
          error && <div className="error">Error!</div>
        }
        <Board model={data}></Board>
        <button onClick={() => setPlayer((p) => p == "X" ? "O" : "X")}>
          Player is {player}
        </button>
      </div>
    </>
  )
}

export default App
