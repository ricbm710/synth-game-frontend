import { useEffect, useState } from "react";
//utils
import { getAllSynths } from "../utils/dbutils/getAllSynths";
import { getPlayableSynths } from "../utils/miscutils/getPlayableSynths";
//types
import { Synth } from "../types/Synth";

const Game = () => {
  //all synths available
  const [allSynths, setallSynths] = useState<Synth[]>([]);
  //synths to play in this game
  const [synthsToPlay, setSynthsToPlay] = useState<Synth[]>([]);

  //get all synths
  const getAllSynthsCaller = async () => {
    try {
      const synths = await getAllSynths(); // Await the promise here
      setallSynths(synths);
    } catch (error: any) {
      // Handle the error if getAllSynths throws an error
      console.error("Error occurred while fetching synths:", error.message);
      // Optionally, display a user-friendly message or take other actions
    }
  };
  //this effect starts on component mount
  useEffect(() => {
    getAllSynthsCaller();
  }, []);
  //this effect starts only if allSynths has been filled with data
  useEffect(() => {
    setSynthsToPlay(getPlayableSynths(allSynths));
  }, [allSynths]);

  return <div>Game</div>;
};

export default Game;
