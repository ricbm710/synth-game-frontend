//types
import { Synth } from "../../types/Synth";

export const getPlayableSynths = (synths: Synth[]): Synth[] => {
  console.log(synths);
  //define number of synths per game
  const SYNTH_QTY = 10;

  const shuffled = synths.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, SYNTH_QTY);
};
