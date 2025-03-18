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
  const [score, setScore] = useState<number>(0);

  //image path
  const IMGPATH =
    import.meta.env.VITE_IMAGE_PATH === undefined
      ? ""
      : import.meta.env.VITE_IMAGE_PATH;

  const user = localStorage.getItem("user");

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
      <div className="flex justify-around p-2 bg-col-2 text-lg">
        <p>ID:{user}</p>
        <p>Score:{score}</p>
      </div>
      <h3 className="text-center text-xl font-bold mt-4 mb-2">
        Synth # {currentIndex + 1}
      </h3>
      <div className="max-h-xs w-auto p-2 ">
        <img
          src={`${IMGPATH}/images/${synths[currentIndex].image_url}`}
          alt={synths[currentIndex].image_url}
          className="border-2 border-col-3 rounded-md"
        />
      </div>
      <div className="flex flex-col mt-2">
        <h3 className="text-center text-xl font-bold">Guess:</h3>
        <form className="flex flex-col items-center">
          <div className="flex flex-row justify-around gap-4">
            <div className="flex flex-col">
              <label htmlFor="manufacturer" className="text-center">
                Manufacturer:
              </label>
              <input
                type="text"
                name="manufacturer"
                className="bg-white w-[175px] p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="model" className="text-center">
                Model:
              </label>
              <input
                type="text"
                name="model"
                className="bg-white w-[175px] p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <button
            type="submit"
            className="my-4 p-2 border rounded-md bg-col-4 w-[175px] font-semibold text-lg"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default SynthSlide;
