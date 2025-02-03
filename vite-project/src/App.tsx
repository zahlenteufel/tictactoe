import { useState } from 'react'
import './App.css'

function Board() {
  return (
    <div className="board">
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>4</div>
      <div>5</div>
      <div>6</div>
      <div>7</div>
      <div>8</div>
      <div>9</div>
    </div >
  )
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>TicTacToe</h1>
      <div className="card">
        <div>
          <Board></Board>
        </div>

        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  )
}

export default App
