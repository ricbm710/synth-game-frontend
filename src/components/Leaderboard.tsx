import { useEffect, useState } from "react";
//types
import { LeaderboardType } from "../types/LeaderboardType";
//utils
import { getLeaderboard } from "../utils/dbutils/getLeaderboard";
//assets
import trophyImage from "../assets/trophy2.png";

const Leaderboard = () => {
  // leaderboard
  const [leaderboard, setLeaderboard] = useState<LeaderboardType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    //* get leaderboard
    const getLeaderboardCaller = async () => {
      try {
        const data = await getLeaderboard();
        setLeaderboard(data);
        setLoading(false);
      } catch (error: any) {
        console.error(
          "Error occurred while retrieving leaderboard:",
          error.message
        );
      }
    };

    getLeaderboardCaller();
  }, []);

  return (
    <>
      <div>
        <img
          src={trophyImage}
          className="w-[60px] sm:w-[80px] md:w-[100px] mx-auto"
        />
        <h1 className="text-center font-bold text-xl">Leaderboard</h1>
      </div>
      {!loading && leaderboard.length > 0 ? (
        <div className="flex flex-col justify-center items-center w-full max-w-3xl mx-auto p-4">
          <div className="overflow-x-auto w-full mt-4">
            <table className="bg-col-2 text-center rounded-md w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-sm sm:text-base md:text-lg">
                    #
                  </th>
                  <th className="px-4 py-2 text-sm sm:text-base md:text-lg">
                    Player
                  </th>
                  <th className="px-4 py-2 text-sm sm:text-base md:text-lg">
                    Score
                  </th>
                  <th className="px-4 py-2 text-sm sm:text-base md:text-lg">
                    Date
                  </th>
                  <th className="px-4 py-2 text-sm sm:text-base md:text-lg">
                    UTC Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr key={index} className="odd:bg-col-1 even:bg-col-2">
                    <td className="px-2 py-1">{index + 1}</td>
                    <td className="px-2 py-1">{entry.player}</td>
                    <td className="px-2 py-1">{entry.score}</td>
                    <td className="px-2 py-1">{entry.date}</td>
                    <td className="px-2 py-1">{entry.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-center text-lg mt-4">Nothing here yet.</p>
        </div>
      )}
    </>
  );
};

export default Leaderboard;
