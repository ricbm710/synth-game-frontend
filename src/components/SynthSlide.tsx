import { useEffect, useState } from "react";
//types
import { Synth } from "../types/Synth";

interface SyntSlideProps {
  synths: Synth[];
  interval: number;
}

const SynthSlide = ({ synths, interval }: SyntSlideProps) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (currentIndex + 1 >= synths.length) {
      setGameOver(true);
      return; //stop timer
    }
    const timer = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, interval);
    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <div>
      {synths[currentIndex].model}
      <p>{currentIndex}</p>
      <p>{gameOver && "se acabo"}</p>
    </div>
  );
};

export default SynthSlide;
