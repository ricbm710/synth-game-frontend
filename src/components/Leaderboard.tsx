import { useEffect, useState } from "react";
//types
import { LeaderboardType } from "../types/LeaderboardType";
//utils
import { getLeaderboard } from "../utils/dbutils/getLeaderboard";

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
        console.log("Leaderboard retrieved!");
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
      {!loading && leaderboard.length > 0 && (
        <div>
          <h1 className="text-center">Leaderboard</h1>
          <table>
            <thead>
              <tr>
                <th>Player</th>
                <th>Score</th>
                <th>Date</th>
                <th>UTC Time</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.player}</td>
                  <td>{entry.score}</td>
                  <td>{entry.date}</td>
                  <td>{entry.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Leaderboard;
