import { useEffect, useState } from "react";
//utils
import { getAllSynths } from "../utils/dbutils/getAllSynths";
import { createPlayer } from "../utils/dbutils/createPlayer";
import { getPlayableSynths } from "../utils/miscutils/getPlayableSynths";
//types
import { Synth } from "../types/Synth";
//components
import SynthSlide from "../components/SynthSlide";
import SynthSlider from "../components/SynthSlider";

const Game = () => {
  //all synths available
  const [allSynths, setAllSynths] = useState<Synth[]>([]);
  //synths to play in this game
  const [synthsToPlay, setSynthsToPlay] = useState<Synth[]>([]);
  //synths to play loading...
  const [isLoading, setIsLoading] = useState<boolean>(true);

  //time per synth (ms)
  const TIMEXSYNTH = 10000;

  //get user
  const [user] = useState<string | null>(() => localStorage.getItem("user"));

  useEffect(() => {
    const getAllSynthsCaller = async () => {
      try {
        const synths = await getAllSynths();
        setAllSynths(synths);
      } catch (error: any) {
        console.error("Error occurred while fetching synths:", error.message);
      }
    };

    getAllSynthsCaller();
  }, []);

  useEffect(() => {
    const createPlayerCaller = async () => {
      if (user && user.trim() !== "") {
        try {
          await createPlayer(user);
        } catch (error: any) {
          console.error("Failed to create player:", error.message);
        }
      }
    };

    createPlayerCaller();
  }, []);

  //this effect starts only if allSynths has been filled with data
  useEffect(() => {
    if (allSynths.length > 0) {
      const playableSynths = getPlayableSynths(allSynths);
      setSynthsToPlay(playableSynths);
      setIsLoading(false); // Move this here to handle all cases
    }
  }, [allSynths]);

  return (
    <div>
      {!isLoading && (
        <SynthSlider
          synths={synthsToPlay}
          interval={TIMEXSYNTH}
          manufacturers={allSynths.map((synth) => synth.manufacturer)}
          models={allSynths.map((synth) => synth.model)}
          user={user}
        />
      )}
    </div>
  );
};

export default Game;
