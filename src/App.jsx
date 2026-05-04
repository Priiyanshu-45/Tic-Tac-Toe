import { useEffect, useState } from "react";
import clickSound from "./assets/click.mp3";
import winSoundFile from "./assets/win.mp3";
import "./App.css";
import { useRef } from "react";

const DRAW_RESTART_MS = 580;

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState("X");
  const [winner, setWinner] = useState("");
  const [screen, setScreen] = useState("menu");
  const [boardKey, setBoardKey] = useState(0);

  const isDraw = board.every((c) => c !== null) && !winner;

  useEffect(() => {
    if (!isDraw) return;
    const t = setTimeout(() => {
      setBoardKey((k) => k + 1);
      setBoard(Array(9).fill(null));
      setTurn("X");
      setWinner("");
    }, DRAW_RESTART_MS);
    return () => clearTimeout(t);
  }, [isDraw]);

  
  const moveSound = useRef(new Audio(clickSound))
  const winSound = useRef(new Audio(winSoundFile))

  useEffect(() => {
    moveSound.current.volume = 0.4;
    moveSound.current.playbackRate = 1.5;
  }, [])

  function moved(i) {
    if (board[i] === null) {
      moveSound.current.currentTime = 0;  
      moveSound.current.play();
      let newBoard = [...board];
      newBoard[i] = turn;
      setBoard(newBoard);
      if (isWinner(newBoard, turn)) {
        moveSound.current.pause();
        winSound.current.play();
        setWinner(turn);
      }
      setTurn((prev) => {
        if (prev === "X") return "O";
        else return "X";
      });
    }
  }


  function isWinner(newboard, player) {
    const wins = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let winCnd of wins) {
      let a = winCnd[0];
      let b = winCnd[1];
      let c = winCnd[2];
      if (
        newboard[a] === player &&
        newboard[b] === player &&
        newboard[c] === player
      )
        return true;
    }
    return false;
  }

  function restart() {
    moveSound.current.currentTime = 0;
    moveSound.current.play();
    setBoardKey((k) => k + 1);
    setBoard(Array(9).fill(null));
    setTurn("X");
    setWinner("");
  }

  let cells = [];
  for (let i = 0; i < 9; i++) {
    cells.push(
      <div
        key={i}
        onClick={() => moved(i)}
        className="border-2 rounded-3xl flex justify-center items-center aspect-square text-2xl"
      >
        {board[i]}
      </div>,
    );
  }

  if (screen === "menu") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-50 h-50 flex flex-col">
          <button
            className="border-2 px-1 py-2 rounded-3xl mt-5 mb-3 hover:scale-110 duration-250 hover:bg-green-500 border-green-500 hover:text-mist-800 hover:border-white"
            onClick={() => {
              moveSound.current.currentTime = 0;
              moveSound.current.play();
              setScreen("game_offline");
            }}
          >
            Play with Friend (Local)
          </button>
          <button
            className="border-2 px-1 py-2 rounded-3xl mb-3 hover:scale-110 duration-250 hover:bg-green-500 border-green-500 hover:text-mist-800 hover:border-white"
            onClick={() => {
              moveSound.current.currentTime = 0;
              moveSound.current.play();
              setScreen("game_online");
            }}
          >
            Play Online
          </button>
        </div>
      </div>
    );
  }

  if (screen === "game_offline") {
    return (
      <>
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
          <button
            onClick={() => {
              moveSound.current.currentTime = 0;
              moveSound.current.play();
              setScreen("menu");
            }}
            className="w-72 rounded-2xl border-2 border-green-500 py-2 text-sm hover:bg-green-500 hover:font-semibold hover:text-mist-900 hover:border-white hover:scale-110 duration-250"
          >
            ← Menu
          </button>

          <div className="flex w-72 justify-between gap-2 text-sm sm:text-base">
            <span
              className={`rounded-2xl border-2 p-2 ${turn === "X" ? "bg-green-500" : ""}`}
            >
              PlayerX
            </span>
            <span
              className={`rounded-2xl border-2 border-dotted p-2 ${turn === "O" ? "bg-green-400" : ""}`}
            >
              PlayerO
            </span>
          </div>

          <div
            key={boardKey}
            className={`grid grid-cols-3 grid-rows-3 w-72 h-72 gap-1 border-gray-300 p-1 ${boardKey > 0 ? "board-mount" : ""} ${isDraw ? "board-draw-pulse" : ""}`}
          >
            {cells}
          </div>
        </div>

        {winner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="animate-[pop_0.3s_ease-out_forwards] w-64 h-64 bg-slate-800 text-gray-300 rounded-2xl flex flex-col items-center justify-center gap-12">
              <div className="font-bold">Player {winner} Win!</div>
              <button
                onClick={() => restart()}
                className="text-mist-900 bg-green-500 border-2 p-1 hover:bg-mist-900 hover:text-green-500 hover:scale-110 duration-310"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  if (screen === "game_online") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col w-72 h-72 rounded-2xl p-5 bg-black gap-10 justify-center">
          <button
            onClick={() => {
              moveSound.current.currentTime = 0;
              moveSound.current.play();
              setScreen("menu");
            }}
            className=" rounded-2xl border-2 border-green-500 py-2 text-sm hover:bg-green-500 hover:font-semibold hover:text-mist-900 hover:border-white hover:scale-110 duration-250"
          >
             Menu
          </button>
          <button className="border-2 px-1 py-2 rounded-3xl mb-3 hover:scale-110 duration-250 hover:bg-green-500 border-green-500 hover:text-mist-800 hover:border-white">
            Create Room
          </button>
          <button className="border-2 px-1 py-2 rounded-3xl mb-3 hover:scale-110 duration-250 hover:bg-green-500 border-green-500 hover:text-mist-800 hover:border-white">
            Join Room
          </button>
        </div>
      </div>
    );
  }
}

export default App;
