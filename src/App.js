import { useState } from "react";
import BG from "./cats/BG.jpg.webp";
import MB from "./cats/MB.jpg.webp";
import PE from "./cats/PE.jpg.webp";
import SF from "./cats/SF.jpg.webp";
import SI from "./cats/SI.jpg.webp";
import TA from "./cats/TA.jpg.webp";

function App() {

  const catImages = { SI, PE, TA, MB, BG, SF };

  const [board, setBoard] = useState([
    ["SI","PE","TA","MB","BG","SF","SI","PE","TA"],
    ["PE","TA","MB","BG","SF","SI","PE","TA","MB"],
    ["TA","MB","BG","SF","SI","PE","TA","MB","BG"],
    ["MB","BG","SF","SI","PE","TA","MB","BG","SF"],
    ["BG","SF","SI","PE","TA","MB","BG","SF","SI"],
    ["SF","SI","PE","TA","MB","BG","SF","SI","PE"],
    ["SI","PE","TA","MB","BG","SF","SI","PE","TA"],
    ["PE","TA","MB","BG","SF","SI","PE","TA","MB"],
    ["TA","MB","BG","SF","SI","PE","TA","MB","BG"],
  ]);

  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(20);
  const [gameOver, setGameOver] = useState(false);

  function findMatches(b) {
    const matched = Array.from({ length: 9 }, () => Array(9).fill(false));
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 7; c++) {
        if (b[r][c] && b[r][c] === b[r][c+1] && b[r][c] === b[r][c+2]) {
          matched[r][c] = matched[r][c+1] = matched[r][c+2] = true;
        }
      }
    }
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 9; c++) {
        if (b[r][c] && b[r][c] === b[r+1][c] && b[r][c] === b[r+2][c]) {
          matched[r][c] = matched[r+1][c] = matched[r+2][c] = true;
        }
      }
    }
    return matched;
  }

  function removeMatches(b, matched) {
    let count = 0;
    const newBoard = b.map((row, r) =>
      row.map((code, c) => {
        if (matched[r][c]) { count++; return null; }
        return code;
      })
    );
    return { newBoard, count };
  }

  function dropCats(b) {
    const newBoard = Array.from({ length: 9 }, () => Array(9).fill(null));
    const breeds = ["SI","PE","TA","MB","BG","SF"];
    for (let c = 0; c < 9; c++) {
      let emptyRow = 8;
      for (let r = 8; r >= 0; r--) {
        if (b[r][c] !== null) {
          newBoard[emptyRow][c] = b[r][c];
          emptyRow--;
        }
      }
      for (let r = emptyRow; r >= 0; r--) {
        newBoard[r][c] = breeds[Math.floor(Math.random() * breeds.length)];
      }
    }
    return newBoard;
  }

  function handleClick(row, col) {
    if (gameOver) return;
    if (!selected) {
      setSelected({ row, col });
      return;
    }

    const rowDiff = Math.abs(selected.row - row);
    const colDiff = Math.abs(selected.col - col);
    const isNeighbor = (rowDiff === 1 && colDiff === 0) ||
                       (rowDiff === 0 && colDiff === 1);

    if (isNeighbor) {
      let newBoard = board.map(r => [...r]);
      const temp = newBoard[selected.row][selected.col];
      newBoard[selected.row][selected.col] = newBoard[row][col];
      newBoard[row][col] = temp;

      const matched = findMatches(newBoard);
      const hasMatch = matched.some(row => row.some(cell => cell));

      if (hasMatch) {
        const { newBoard: cleared, count } = removeMatches(newBoard, matched);
        const dropped = dropCats(cleared);
        setBoard(dropped);
        setScore(prev => prev + count * 10);
      } else {
        setBoard(newBoard);
      }

      const newMoves = moves - 1;
      setMoves(newMoves);
      if (newMoves === 0) setGameOver(true);
    }

    setSelected(null);
  }

  function restartGame() {
    setBoard([
      ["SI","PE","TA","MB","BG","SF","SI","PE","TA"],
      ["PE","TA","MB","BG","SF","SI","PE","TA","MB"],
      ["TA","MB","BG","SF","SI","PE","TA","MB","BG"],
      ["MB","BG","SF","SI","PE","TA","MB","BG","SF"],
      ["BG","SF","SI","PE","TA","MB","BG","SF","SI"],
["SF","SI","PE","TA","MB","BG","SF","SI","PE"],
      ["SI","PE","TA","MB","BG","SF","SI","PE","TA"],
      ["PE","TA","MB","BG","SF","SI","PE","TA","MB"],
      ["TA","MB","BG","SF","SI","PE","TA","MB","BG"],
    ]);
    setScore(0);
    setMoves(20);
    setGameOver(false);
    setSelected(null);
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: "#fff0f5",
      minHeight: "100vh",
      padding: "20px",
    }}>

      <h1 style={{ color: "#ff85b3", fontSize: "32px" }}>
        🐱 Mochi Crush
      </h1>

      <div style={{
        display: "flex",
        gap: "40px",
        marginBottom: "16px",
      }}>
        <p style={{ color: "#ff85b3", fontSize: "22px" }}>
          ⭐ Score: {score}
        </p>
        <p style={{ color: moves <= 5 ? "red" : "#ff85b3", fontSize: "22px" }}>
          👣 Moves: {moves}
        </p>
      </div>

      {gameOver && (
        <div style={{
          backgroundColor: "#ffb7d5",
          padding: "20px",
          borderRadius: "20px",
          textAlign: "center",
          marginBottom: "16px",
        }}>
          <p style={{ fontSize: "24px", color: "#ff85b3" }}>
            🐱 Game Over!
          </p>
          <p style={{ fontSize: "20px", color: "#ff85b3" }}>
            Final Score: {score}
          </p>
          <button
            onClick={restartGame}
            style={{
              backgroundColor: "#ff85b3",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "10px",
              fontSize: "18px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Play Again 🐱
          </button>
        </div>
      )}

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(9, 60px)",
        gap: "6px",
        backgroundColor: "#ffe0ef",
        padding: "16px",
        borderRadius: "20px",
        opacity: gameOver ? 0.5 : 1,
      }}>
        {board.map((row, r) =>
          row.map((code, c) => (
            <div
              key={r + "-" + c}
              onClick={() => handleClick(r, c)}
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "10px",
                overflow: "hidden",
                border: selected &&
                        selected.row === r &&
                        selected.col === c
                  ? "3px solid #ff85b3"
                  : "2px solid #ffb7d5",
                transform: selected &&
                           selected.row === r &&
                           selected.col === c
                  ? "scale(1.1)"
                  : "scale(1)",
                transition: "all 0.2s ease",
                cursor: gameOver ? "not-allowed" : "pointer",
              }}
            >
              <img
                src={catImages[code]}
                alt={code}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  pointerEvents: "none",
                }}
              />
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default App;