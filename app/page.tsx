import Image from "next/image";

export default function Home() {
  // Dummy data for the tournament
  const couples = [
    "Vannelo / Diego",
    "Yira / Monse",
    "Ivan / Christian",
    "Cesar / Limón",
    "Ivan / Ariel",
    "Pablo / Javi",
  ];

  const scores = [
    [null, 6, 6, 6, 2, 6],
    [2, null, 6, 5, 6, 3],
    [3, 4, null, 6, 2, 6],
    [4, 6, 3, null, 6, 2],
    [6, 2, 4, 6, null, 5],
    [2, 6, 3, 6, 6, null],
  ];

  const currentMatchNumber = 4;
  const currentLeader = "Vannelo / Diego";

  // Calculate total scores for each couple
  const totalScores = scores.map((row) =>
    row.reduce(
      (total: number, score) => (score !== null ? total + score : total),
      0
    )
  );

  return (
    <main className="min-h-[100vh] flex justify-center items-center">
      <Image
        src="/img/home-bg.jpg"
        alt="Padel court"
        layout="fill"
        objectFit="cover"
        quality={100}
      />
      <div className="absolute inset-0 bg-black opacity-80 z-10"></div>
      <div className="absolute inset-0 z-20 min-h-[100vh] flex justify-center items-center">
        {/* HEADING */}
        <div className="flex flex-col items-center">
          <h1 className="text-primary text-6xl font-bold tracking-tighter">
            HACK PADEL
          </h1>
          <h2 className="font-bold tracking-tighter uppercase text-2xl">
            Tournament
          </h2>
          {/* SCORES */}
          <div className="mt-4 uppercase">
            <div className="flex justify-center items-center gap-4 mb-4">
              <h3 className="text-xl font-bold">
                Líderes: <span className="text-primary">{currentLeader}</span>
              </h3>
              <h4 className="text-lg font-bold">
                Partido:{" "}
                <span className="text-primary font-sans">
                  {currentMatchNumber}/{couples.length - 1}
                </span>
              </h4>
            </div>

            <table className="table-auto border-collapse border border-gray-400 font-bold w-full text-2xl">
              <thead>
                <tr>
                  <th className="border border-gray-400 p-2 text-primary">
                    Parejas
                  </th>
                  {couples.map((couple, index) => (
                    <th
                      key={index}
                      className="border border-gray-400 p-2 text-lg"
                    >
                      {couple}
                    </th>
                  ))}
                  <th className="border border-gray-400 p-2 text-primary">
                    Puntos
                  </th>
                </tr>
              </thead>
              <tbody>
                {scores.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="border border-gray-400 p-2 font-bold text-lg">
                      {couples[rowIndex]}
                    </td>
                    {row.map((score, colIndex) => (
                      <td
                        key={colIndex}
                        className="border border-gray-400 p-2 text-center font-sans text-3xl"
                      >
                        {score === 6 ? (
                          <span className="text-primary">{score}</span>
                        ) : score !== null ? (
                          score
                        ) : (
                          "-"
                        )}
                      </td>
                    ))}
                    <td className="border border-gray-400 p-2 text-center font-bold font-sans">
                      {totalScores[rowIndex]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
