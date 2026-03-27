import { useState, useEffect } from "react";
import BG from "./cats/BG.jpg.webp";
import MB from "./cats/MB.jpg.webp";
import PE from "./cats/PE.jpg.webp";
import SF from "./cats/SF.jpg.webp";
import SI from "./cats/SI.jpg.webp";
import TA from "./cats/TA.jpg.webp";
import { saveScore, getLeaderboard } from "./firebase";

function playPop() {
  const ctx = new AudioContext();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.connect(g); g.connect(ctx.destination);
  o.frequency.setValueAtTime(600, ctx.currentTime);
  g.gain.setValueAtTime(0.3, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
  o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.1);
}

function playMeow() {
  const ctx = new AudioContext();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.connect(g); g.connect(ctx.destination);
  o.type = "sine";
  o.frequency.setValueAtTime(400, ctx.currentTime);
  o.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
  o.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.3);
  g.gain.setValueAtTime(0.3, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.3);
}

function playGameOver() {
  const ctx = new AudioContext();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.connect(g); g.connect(ctx.destination);
  o.type = "sawtooth";
  o.frequency.setValueAtTime(300, ctx.currentTime);
  o.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.5);
  g.gain.setValueAtTime(0.3, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
  o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.5);
}

const INITIAL_BOARD = [
  ["SI","PE","TA","MB","BG","SF","SI","PE","TA"],
  ["PE","TA","MB","BG","SF","SI","PE","TA","MB"],
  ["TA","MB","BG","SF","SI","PE","TA","MB","BG"],
  ["MB","BG","SF","SI","PE","TA","MB","BG","SF"],
  ["BG","SF","SI","PE","TA","MB","BG","SF","SI"],
  ["SF","SI","PE","TA","MB","BG","SF","SI","PE"],
  ["SI","PE","TA","MB","BG","SF","SI","PE","TA"],
  ["PE","TA","MB","BG","SF","SI","PE","TA","MB"],
  ["TA","MB","BG","SF","SI","PE","TA","MB","BG"],
];

const confettiColors = ["#ff85b3","#ffb7d5","#ffe0ef","#ff6b9d","#ffd1e8"];

function Confetti({ show }) {
  if (!show) return null;
  return (
    <div style={{ position:"fixed", top:0, left:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:999 }}>
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: (i * 5) + "%",
          top: "-10px",
          width: "10px",
          height: "10px",
          backgroundColor: confettiColors[i % confettiColors.length],
          borderRadius: i % 2 === 0 ? "50%" : "0",
          animation: "fall 2s linear forwards",
          animationDelay: (i * 0.05) + "s",
        }} />
      ))}
    </div>
  );
}

function App() {
  const catImages = { SI, PE, TA, MB, BG, SF };
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(20);
  const [gameOver, setGameOver] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [nameEntered, setNameEntered] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    getLeaderboard().then(data => setLeaderboard(data));
  }, []);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap');
      * { font-family: 'Nunito', sans-serif; }
      @keyframes sparkle {
        0%, 100% { opacity: 0; transform: scale(0); }
        50% { opacity: 1; transform: scale(1); }
      }
      @keyframes fall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
      }
      @keyframes glow {
        0%, 100% { box-shadow: 0 0 10px #ffb7d5, 0 0 20px #ffb7d5; }
        50% { box-shadow: 0 0 20px #ff85b3, 0 0 40px #ff85b3; }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      .score-box {
        animation: glow 2s infinite;
        background: linear-gradient(135deg, #ff85b3, #ffb7d5);
        border-radius: 16px;
        padding: 10px 24px;
        color: white;
        font-size: 22px;
        font-weight: 900;
      }
      .title {
        animation: float 3s ease-in-out infinite;
        background: linear-gradient(135deg, #ff85b3, #ff6b9d);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 48px;
        font-weight: 900;
        margin-bottom: 10px;
      }
      .play-button {
        background: linear-gradient(135deg, #ff85b3, #ff6b9d);
        color: white;
        border: none;
        padding: 14px 40px;
        border-radius: 30px;
        font-size: 22px;
        font-weight: 900;
        cursor: pointer;
        animation: pulse 2s infinite;
        box-shadow: 0 4px 20px #ffb7d5;
      }
      .again-button {
        background: linear-gradient(135deg, #ff85b3, #ff6b9d);
        color: white;
        border: none;
        padding: 12px 30px;
        border-radius: 30px;
        font-size: 20px;
        font-weight: 900;
        cursor: pointer;
        box-shadow: 0 4px 20px #ffb7d5;
        margin-top: 10px;
      }
      .sparkle {
        position: absolute;
        border-radius: 50%;
        background-color: #ffb7d5;
        animation: sparkle 2s infinite;
      }
    `;
    document.head.appendChild(style);
  }, []);

  const sparkles = [
    { top:"10%", left:"5%", width:"8px", height:"8px", animationDelay:"0s" },
    { top:"20%", left:"90%", width:"6px", height:"6px", animationDelay:"0.3s" },
    { top:"50%", left:"3%", width:"10px", height:"10px", animationDelay:"0.6s" },
    { top:"70%", left:"95%", width:"7px", height:"7px", animationDelay:"0.9s" },
    { top:"85%", left:"10%", width:"9px", height:"9px", animationDelay:"1.2s" },
    { top:"30%", left:"50%", width:"5px", height:"5px", animationDelay:"1.5s" },
    { top:"60%", left:"70%", width:"8px", height:"8px", animationDelay:"0.4s" },
    { top:"15%", left:"40%", width:"6px", height:"6px", animationDelay:"0.8s" },
  ];

  function findMatches(b) {
    const matched = Array.from({ length: 9 }, () => Array(9).fill(false));
    for (let r = 0; r < 9; r++)
      for (let c = 0; c < 7; c++)
        if (b[r][c] && b[r][c] === b[r][c+1] && b[r][c] === b[r][c+2])
          matched[r][c] = matched[r][c+1] = matched[r][c+2] = true;
    for (let r = 0; r < 7; r++)
      for (let c = 0; c < 9; c++)
        if (b[r][c] && b[r][c] === b[r+1][c] && b[r][c] === b[r+2][c])
          matched[r][c] = matched[r+1][c] = matched[r+2][c] = true;
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
      for (let r = 8; r >= 0; r--)
        if (b[r][c] !== null) { newBoard[emptyRow][c] = b[r][c]; emptyRow--; }
      for (let r = emptyRow; r >= 0; r--)
        newBoard[r][c] = breeds[Math.floor(Math.random() * breeds.length)];
    }
    return newBoard;
  }

  async function handleGameOver(finalScore) {
    playGameOver();
    setGameOver(true);
    await saveScore(playerName, finalScore);
    const updated = await getLeaderboard();
    setLeaderboard(updated);
  }

  function handleClick(row, col) {
    if (gameOver) return;
    if (!selected) { playPop(); setSelected({ row, col }); return; }
    const rowDiff = Math.abs(selected.row - row);
    const colDiff = Math.abs(selected.col - col);
    const isNeighbor = (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    if (isNeighbor) {
      let newBoard = board.map(r => [...r]);
      const temp = newBoard[selected.row][selected.col];
      newBoard[selected.row][selected.col] = newBoard[row][col];
      newBoard[row][col] = temp;
      const matched = findMatches(newBoard);
      const hasMatch = matched.some(r => r.some(cell => cell));
      let newScore = score;

      if (hasMatch) {
        let currentBoard = newBoard;
        let totalCount = 0;

        while (true) {
          const currentMatched = findMatches(currentBoard);
          const currentHasMatch = currentMatched.some(r => r.some(cell => cell));
          if (!currentHasMatch) break;
          playMeow();
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 1500);
          const { newBoard: cleared, count } = removeMatches(currentBoard, currentMatched);
          currentBoard = dropCats(cleared);
          totalCount += count;
        }

        newBoard = currentBoard;
        newScore = score + totalCount * 10;
        setScore(newScore);
      }

      setBoard(newBoard);
      const newMoves = moves - 1;
      setMoves(newMoves);
      if (newMoves === 0) handleGameOver(newScore);
    }
    setSelected(null);
  }

  function restartGame() {
    setBoard(INITIAL_BOARD);
    setScore(0);
    setMoves(20);
    setGameOver(false);
    setSelected(null);
  }

  if (!nameEntered) {
    return (
      <div style={{
        display:"flex", flexDirection:"column", alignItems:"center",
        justifyContent:"center",
        background:"linear-gradient(135deg, #fff0f5, #ffe0ef)",
        minHeight:"100vh", padding:"20px",
        position:"relative", overflow:"hidden",
      }}>
        {sparkles.map((s, i) => (
          <div key={i} className="sparkle" style={s} />
        ))}
        <h1 className="title">🐱 Mochi Crush</h1>
        <p style={{ color:"#ff85b3", fontSize:"20px", fontWeight:"700" }}>
          Enter your name to play!
        </p>
        <input
          type="text"
          placeholder="Your name..."
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          style={{
            padding:"12px", fontSize:"18px", borderRadius:"20px",
            border:"3px solid #ffb7d5", marginBottom:"20px",
            textAlign:"center", outline:"none",
            fontWeight:"700", background:"white",
            boxShadow:"0 4px 15px #ffb7d5",
          }}
        />
        <button className="play-button"
          onClick={() => { if (playerName.trim() !== "") setNameEntered(true); }}>
          Play 🐱
        </button>
      </div>
    );
  }

  return (
    <div style={{
      display:"flex", flexDirection:"column", alignItems:"center",
      background:"linear-gradient(135deg, #fff0f5, #ffe0ef, #fff0f5)",
      minHeight:"100vh", padding:"20px",
      position:"relative", overflow:"hidden",
    }}>
      {sparkles.map((s, i) => (
        <div key={i} className="sparkle" style={s} />
      ))}
      <Confetti show={showConfetti} />

      <h1 className="title">🐱 Mochi Crush</h1>
      <div style={{ display:"flex", gap:"20px", marginBottom:"20px" }}>
        <div className="score-box">⭐ Score: {score}</div>
        <div className="score-box" style={{
          background: moves <= 5
            ? "linear-gradient(135deg, #ff4444, #ff6666)"
            : "linear-gradient(135deg, #ff85b3, #ffb7d5)"
        }}>
          👣 Moves: {moves}
        </div>
      </div>

      {gameOver && (
        <div style={{
          background:"linear-gradient(135deg, #ffb7d5, #ffe0ef)",
          padding:"24px", borderRadius:"24px",
          textAlign:"center", marginBottom:"20px",
          boxShadow:"0 8px 32px #ffb7d5",
        }}>
          <p style={{ fontSize:"28px", color:"#ff85b3", fontWeight:"900" }}>
            🐱 Game Over!
          </p>
          <p style={{ fontSize:"22px", color:"#ff85b3", fontWeight:"700" }}>
            Final Score: {score} ⭐
          </p>
          <button className="again-button" onClick={restartGame}>
            Play Again 🐱
          </button>
        </div>
      )}

      <div style={{
        display:"grid", gridTemplateColumns:"repeat(9, 64px)",
        gap:"8px",
        background:"linear-gradient(135deg, #ffe0ef, #ffb7d5)",
        padding:"20px", borderRadius:"28px",
        boxShadow:"0 8px 32px #ffb7d5",
        opacity: gameOver ? 0.5 : 1,
      }}>
        {board.map((row, r) =>
          row.map((code, c) => (
            <div key={r+"-"+c} onClick={() => handleClick(r, c)}
              style={{
                width:"64px", height:"64px", borderRadius:"16px",
                overflow:"hidden",
                border: selected && selected.row===r && selected.col===c
                  ? "3px solid #ff85b3"
                  : "3px solid rgba(255,255,255,0.6)",
                transform: selected && selected.row===r && selected.col===c
                  ? "scale(1.15)" : "scale(1)",
                transition:"all 0.2s ease",
                cursor: gameOver ? "not-allowed" : "pointer",
                boxShadow: selected && selected.row===r && selected.col===c
                  ? "0 0 16px #ff85b3"
                  : "0 2px 8px rgba(255,133,179,0.3)",
              }}>
              <img src={catImages[code]} alt={code}
                style={{ width:"100%", height:"100%", objectFit:"cover", pointerEvents:"none" }} />
            </div>
          ))
        )}
      </div>

      <div style={{
        marginTop:"30px",
        background:"linear-gradient(135deg, #ffe0ef, #ffb7d5)",
        padding:"24px", borderRadius:"24px",
        width:"320px", textAlign:"center",
        boxShadow:"0 8px 32px #ffb7d5",
      }}>
        <h2 style={{ color:"#ff85b3", fontSize:"26px", fontWeight:"900" }}>
          🏆 Leaderboard
        </h2>
        {leaderboard.length === 0 &&
          <p style={{ color:"#ff85b3", fontWeight:"700" }}>
            No scores yet! Be the first! 🐱
          </p>
        }
        {leaderboard.map((entry, i) => (
          <div key={i} style={{
            display:"flex", justifyContent:"space-between",
            padding:"10px",
            borderBottom:"2px solid rgba(255,133,179,0.3)",
            color:"#ff85b3", fontSize:"18px", fontWeight:"700",
          }}>
            <span>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : (i+1) + "."} {entry.name}</span>
            <span>⭐ {entry.score}</span>
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;