"use client";
import React, { useState, useEffect } from "react";

const BingoBoard: React.FC = () => {
  const emptyBoard: Array<Array<string | null>> = Array(5)
    .fill(null)
    .map(() => Array(5).fill(null));
  const [board, setBoard] = useState<Array<Array<string | null>>>(emptyBoard);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [recommendedCell, setRecommendedCell] = useState<number[] | null>(null);
  const [bingoCount, setBingoCount] = useState(0);
  const [turnNumber, setTurnNumber] = useState(0);

  // 각 칸의 고정된 기본 가능성 배열
  const basePotential: number[][] = Array(5)
    .fill(null)
    .map(() => Array(5).fill(0));

  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      basePotential[r][c] = 1; // 가로
      basePotential[r][c] += 1; // 세로
      if (r === c) basePotential[r][c] += 1; // 대각선
      if (r + c === 4) basePotential[r][c] += 1; // 역대각선
    }
  }

  // 현재 보드 상태에서 칸을 선택했을 때, 빙고 라인 중 이미 선택된 칸 수를 계산
  const calculateLineOverlap = (row: number, col: number) => {
    const lines = {
      row: board[row],
      col: board.map((r) => r[col]),
      diag: row === col ? board.map((r, idx) => r[idx]) : [],
      antiDiag: row + col === 4 ? board.map((r, idx) => r[4 - idx]) : [],
    };

    let overlapCount = 0;
    Object.values(lines).forEach((line) => {
      overlapCount += line.filter((cell) => cell !== null).length;
    });

    return overlapCount;
  };

  // 현재 보드 상태에서 특정 칸을 선택했을 때의 빙고 수를 계산
  const getFutureBingoCount = (row: number, col: number) => {
    const newBoard = board.map((rowArr, r) =>
      rowArr.map((cell, c) =>
        r === row && c === col ? (isPlayerTurn ? "P" : "O") : cell
      )
    );

    return checkBingo(newBoard);
  };

  // 가장 최적의 칸을 추천
  const recommendCell = () => {
    // 4줄 빙고를 즉시 완성할 수 있는 칸 우선 추천
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (board[r][c] === null && getFutureBingoCount(r, c) >= 4) {
          return [r, c];
        }
      }
    }

    let maxOverlap = -1;
    let bestCell = [2, 2]; // 기본 추천 위치로 중앙을 설정

    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === null) {
          const overlap = calculateLineOverlap(rowIndex, colIndex);
          const potential = basePotential[rowIndex][colIndex];
          if (
            overlap > maxOverlap ||
            (overlap === maxOverlap &&
              potential > basePotential[bestCell[0]][bestCell[1]])
          ) {
            maxOverlap = overlap;
            bestCell = [rowIndex, colIndex];
          }
        }
      });
    });

    return bestCell;
  };

  // 플레이어 턴에 맞춰 추천 칸 업데이트
  useEffect(() => {
    if (isPlayerTurn) {
      const [row, col] = recommendCell();
      setRecommendedCell([row, col]);
    } else {
      setRecommendedCell(null);
    }
  }, [board, isPlayerTurn]);

  // 게임 종료 조건 확인
  useEffect(() => {
    const currentBingo = checkBingo(board);
    if (currentBingo >= 4) {
      alert("4빙고 완성!");
      setTurnNumber(0);
      setBoard(emptyBoard);
    }
    if (turnNumber === 16) {
      alert("빙고 실패. 모든 턴을 소진했습니다.");
      setTurnNumber(0);
      setBoard(emptyBoard);
    }
  }, [board]);

  // 보드 상태 변경
  const handleCellClick = (row: number, col: number) => {
    if (board[row][col] !== null) return;

    const newBoard = board.map((rowArr, r) =>
      rowArr.map((cell: string | null, c: number) =>
        r === row && c === col ? (isPlayerTurn ? "P" : "O") : cell
      )
    );

    setBoard(newBoard);
    setIsPlayerTurn(!isPlayerTurn);
    setTurnNumber((prev) => prev + 1);
  };

  // 빙고 체크
  const checkBingo = (board: (string | null)[][]) => {
    const checkLine = (line: (string | null)[]) =>
      line.every((cell) => cell !== null);
    let count = 0;

    for (let i = 0; i < 5; i++) {
      if (checkLine(board[i])) count++;
      if (checkLine(board.map((row) => row[i]))) count++;
    }

    if (checkLine(board.map((row, idx) => row[idx]))) count++;
    if (checkLine(board.map((row, idx) => row[4 - idx]))) count++;

    setBingoCount(count);
    return count;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-5 gap-1 mb-4">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`border border-gray-500 p-1 text-center cursor-pointer text-xs h-10 w-10 ${
                cell === "P" ? "bg-blue-500" : cell === "O" ? "bg-red-500" : ""
              } ${
                recommendedCell &&
                recommendedCell[0] === rowIndex &&
                recommendedCell[1] === colIndex
                  ? "bg-green-300"
                  : ""
              }`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {cell}
            </div>
          ))
        )}
      </div>
      <div className="text-lg">
        <p>
          {isPlayerTurn
            ? "플레이어 턴입니다. 초록색 칸은 추천 칸입니다."
            : "랜덤으로 선택된 칸을 클릭해주세요."}
        </p>
        <p>현재 빙고 수: {bingoCount}</p>
        <p>남은 선택 수: {8 - Math.round(turnNumber / 2)}</p>
      </div>
    </div>
  );
};

export default BingoBoard;
