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

  //image path
  const IMGPATH =
    import.meta.env.VITE_IMAGE_PATH === undefined
      ? ""
      : import.meta.env.VITE_IMAGE_PATH;

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
      <h3 className="text-center text-xl">Synth # {currentIndex + 1}</h3>
      <div>
        <img
          src={`${IMGPATH}/images/${synths[currentIndex].image_url}`}
          alt={synths[currentIndex].image_url}
        />
      </div>
    </div>
  );
};

export default SynthSlide;
