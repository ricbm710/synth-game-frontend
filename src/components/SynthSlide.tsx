import { useEffect, useState } from "react";
//types
import { Synth } from "../types/Synth";

interface SyntSlideProps {
  synths: Synth[];
  interval?: number;
}

const SynthSlide = ({ synths }: SyntSlideProps) => {
  // const [currentIndex, setCurrentIndex] = useState<number>(0);
  // const [gameOver, setGameOver] = useState(false);

  console.log(synths);

  // useEffect(() => {
  //   if (currentIndex >= synths.length) {
  //     setGameOver(true);
  //     return; // Stop the effect
  //   }

  //   const timer = setInterval(() => {
  //     setCurrentIndex((prev) => prev + 1);
  //   }, interval);

  //   return () => clearInterval(timer);
  // }, [currentIndex, interval]);

  return <div>{synths[4].model}</div>;
};

export default SynthSlide;
