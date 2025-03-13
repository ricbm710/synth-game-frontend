import { useEffect } from "react";
//utils
import { getAllSynths } from "../utils/dbutils/getAllSynths";

const Game = () => {
  //get all synths
  const getAllSynthsCaller = async () => {
    try {
      const synths = await getAllSynths(); // Await the promise here
      console.log(synths); // Continue with the data if no error occurs
    } catch (error: any) {
      // Handle the error if getAllSynths throws an error
      console.error("Error occurred while fetching synths:", error.message);
      // Optionally, display a user-friendly message or take other actions
    }
  };

  useEffect(() => {
    getAllSynthsCaller();
  }, []);

  return <div>Game</div>;
};

export default Game;
