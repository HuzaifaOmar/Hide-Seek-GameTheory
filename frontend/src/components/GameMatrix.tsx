import React from "react";
import { useGame } from "../contexts/GameContext";
import { getCellTypeColor } from "../utils/gameUtils";

const GameMatrix: React.FC = () => {
  const { gameState } = useGame();

  if (gameState.round === 0 || !gameState.payoffMatrix.length) {
    return null;
  }
  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4 text-slate-800">Game Matrix</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="py-2 px-3 bg-slate-100 text-slate-600 text-sm font-semibold border border-slate-300"></th>
              {gameState.placeTypes.map((_, colIndex) => (
                <th
                  key={colIndex}
                  className="py-2 px-3 bg-slate-100 text-slate-600 text-sm font-semibold border border-slate-300"
                >
                  S{colIndex + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {gameState.payoffMatrix.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="py-2 px-3 bg-slate-100 text-slate-600 text-sm font-semibold border border-slate-300">
                  H{rowIndex + 1}
                </td>
                {row.map((value, colIndex) => (
                  <td
                    key={colIndex}
                    className={`py-2 px-3 text-center text-sm border border-slate-300 ${
                      rowIndex === colIndex ? "bg-slate-100" : "bg-white"
                    } ${value < 0 ? "text-red-600" : "text-green-600"}`}
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3 text-slate-700">
          Location Types
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {gameState.placeTypes.map((type, index) => (
            <div key={index} className="flex items-center py-1 px-2 rounded-md">
              <div
                className={`w-4 h-4 rounded-full mr-2 ${getCellTypeColor(
                  type.toLowerCase()
                )}`}
              ></div>
              <span className="text-sm">
                Place {index + 1}:{" "}
                {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {gameState.computerStrategy && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3 text-slate-700">
            Probabilities
          </h3>
          <div className="space-y-3">
            {gameState.computerStrategy.probabilities.map((prob, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span>Position {index + 1}</span>
                  <span>{(prob * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${prob * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameMatrix;
