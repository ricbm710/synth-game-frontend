import { useEffect, useState } from "react";
//types
import { Synth } from "../types/Synth";
//utils
import { checkLevel } from "../utils/miscutils/checkLevel";

interface SyntSliderProps {
  synths: Synth[];
  interval: number;
  manufacturers: Synth["manufacturer"][];
  models: Synth["model"][];
  user: string | null;
}

const SynthSlider = ({
  synths,
  interval,
  manufacturers,
  models,
  user,
}: SyntSliderProps) => {
  //*--------------------------------------------------------------------------->
  const IMGPATH =
    import.meta.env.VITE_IMAGE_PATH === undefined
      ? ""
      : import.meta.env.VITE_IMAGE_PATH;

  //*--------------------------------------------------------------------------->
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const [roundOver, setRoundOver] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const [counter, setCounter] = useState<number>(interval / 1000);

  const [score, setScore] = useState<number>(0);

  const [level, setLevel] = useState<string>("");

  //*--------------------------------------------------------------------------->
  useEffect(() => {
    //stops counter
    if (roundOver) {
      return;
    }

    setCounter(interval / 1000);
    setLevel(
      checkLevel(
        synths[currentIndex].times_selected,
        synths[currentIndex].times_guessed
      )
    );

    const countDown = setInterval(() => {
      setCounter((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else {
          //setRoundOver(true);
          return prev;
        }
      });
    }, 1000);

    // const roundTimer = setTimeout(() => {
    //   if (currentIndex + 1 < synths.length) {
    //     setRoundOver(true);
    //   }
    // }, interval);

    const sliderTimer = setTimeout(() => {
      if (currentIndex + 1 < synths.length) {
        setRoundOver(false);
        setCurrentIndex((prev) => prev + 1);
      } else {
        setGameOver(true);
      }
    }, interval + 3000);

    return () => {
      clearTimeout(sliderTimer);
      clearInterval(countDown);
      // clearTimeout(roundTimer);
    };
  }, [currentIndex, roundOver]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setRoundOver(true);

    setTimeout(() => {
      if (currentIndex + 1 < synths.length) {
        setCurrentIndex((prev) => prev + 1);
        setRoundOver(false);
      } else {
        setGameOver(true);
      }
    }, 3000);
  };

  if (gameOver) {
    return <div>Game Over</div>;
  }

  return (
    <div>
      <div className="flex justify-around p-2 bg-col-2 text-lg">
        <p>ID:{user}</p>
        <p>Score:{score}</p>
      </div>
      <div>
        <h3 className="text-center text-xl font-bold mt-4 mb-2">
          Synth # {currentIndex + 1}
        </h3>
        <p className="text-center text-lg">{`Level: ${level}`}</p>
        <div className="max-h-xs w-auto p-2 ">
          <img
            src={`${IMGPATH}/images/${synths[currentIndex].image_url}`}
            alt={synths[currentIndex].image_url}
            className="border-2 border-col-3 rounded-md"
          />
        </div>
        {roundOver ||
          (counter === 0 && (
            <p>
              {synths[currentIndex].manufacturer} - {synths[currentIndex].model}
            </p>
          ))}

        <div
          className={`w-[60px] mx-auto border-3 rounded-4xl ${
            !roundOver && counter > 0 ? "border-col-error" : "border-gray-600"
          }`}
        >
          <p
            className={`text-center font-bold text-4xl ${
              !roundOver && counter > 0 ? "text-col-error" : "text-gray-600"
            }`}
          >
            {counter}
          </p>
        </div>
        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default SynthSlider;
