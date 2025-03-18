import { useEffect, useState } from "react";
//utils
import { getAllSynths } from "../utils/dbutils/getAllSynths";
import { getPlayableSynths } from "../utils/miscutils/getPlayableSynths";
//types
import { Synth } from "../types/Synth";
//components
import SynthSlide from "../components/SynthSlide";

const Game = () => {
  //all synths available
  const [allSynths, setAllSynths] = useState<Synth[]>([]);
  //synths to play in this game
  const [synthsToPlay, setSynthsToPlay] = useState<Synth[]>([]);
  //synths to play loading...
  const [isLoading, setIsLoading] = useState<boolean>(true);

  //time per synth (ms)
  const TIMEXSYNTH = 30000;

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
        <SynthSlide
          synths={synthsToPlay}
          interval={TIMEXSYNTH}
          manufacturers={allSynths.map((synth) => synth.manufacturer)}
          models={allSynths.map((synth) => synth.model)}
        />
      )}
    </div>
  );
};

export default Game;
