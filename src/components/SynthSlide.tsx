import { useEffect, useRef, useState } from "react";
//types
import { Synth } from "../types/Synth";
//components
import Leaderboard from "./Leaderboard";
//utils
import { createAttempt } from "../utils/dbutils/createAttempt";
import { updateSynthTimes } from "../utils/dbutils/updateSynthTimes";
import { checkLevel } from "../utils/miscutils/checkLevel";

interface SyntSlideProps {
  synths: Synth[];
  interval: number;
  manufacturers: Synth["manufacturer"][];
  models: Synth["model"][];
  user: string | null;
}

const SynthSlide = ({
  synths,
  interval,
  manufacturers,
  models,
  user,
}: SyntSlideProps) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [gameOver, setGameOver] = useState(false);
  const [attemptStored, setAttemptStored] = useState(false);
  const [score, setScore] = useState<number>(0);

  //guess state
  const [manufacturerGuessed, setManufacturerGuessed] =
    useState<boolean>(false);
  const [modelGuessed, setModelGuessed] = useState<boolean>(false);
  const [submitClicked, setSubmitClicked] = useState<boolean>(false);

  //get difficulty level
  const [level, setLevel] = useState<string>("init");

  //countdown
  const [counter, setCounter] = useState<number>(interval / 1000);

  //autocomplete feature
  const [manufacturerInput, setManufacturerInput] = useState<string>(""); // for manufacturer input
  const [modelInput, setModelInput] = useState<string>(""); // for model input
  const [manufacturerSuggestions, setManufacturerSuggestions] = useState<
    string[]
  >([]); // for manufacturer suggestions
  const [modelSuggestions, setModelSuggestions] = useState<string[]>([]); // for model suggestions

  // Create refs for input and suggestion lists
  const manufacturerInputRef = useRef<HTMLInputElement | null>(null);
  const modelInputRef = useRef<HTMLInputElement | null>(null);
  const manufacturerSuggestionsRef = useRef<HTMLUListElement | null>(null);
  const modelSuggestionsRef = useRef<HTMLUListElement | null>(null);

  //image path
  const IMGPATH =
    import.meta.env.VITE_IMAGE_PATH === undefined
      ? ""
      : import.meta.env.VITE_IMAGE_PATH;

  //counter 0 & submit button not clicked

  useEffect(() => {
    //-------------------->if game over, store attempt
    if (gameOver) {
      const createAttemptCaller = async () => {
        try {
          await createAttempt(user!, score);
          setAttemptStored(true);
          console.log("Attempt stored!");
        } catch (error: any) {
          console.error(
            "Error occurred while creating attempt:",
            error.message
          );
        }
      };
      createAttemptCaller();
    }
    //-------------------->if game over > Stops the counter. if submitClicked, handleSubmit drives the logic
    if (gameOver || submitClicked) {
      return;
    }

    resetValuesForSlide();

    //countdown every passing second
    const countdownTimer = setInterval(() => {
      setCounter((prev) => prev - 1);
    }, 1000);

    //index counter every "interval" amount of seconds
    const indexTimer = setTimeout(() => {
      if (currentIndex + 1 < synths.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setGameOver(true);
      }
    }, interval);

    return () => {
      clearInterval(countdownTimer);
      clearTimeout(indexTimer);
    };
  }, [currentIndex, submitClicked, gameOver]);

  useEffect(() => {
    if (!submitClicked) {
      //get level on component mount
      setLevel(
        checkLevel(
          synths[currentIndex].times_selected,
          synths[currentIndex].times_guessed
        )
      );
    }
  }, [submitClicked]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const name = e.target.name;

    if (name === "manufacturer") {
      setManufacturerInput(value);
      if (value) {
        const filteredSuggestions = manufacturers.filter((opt) =>
          opt.toLowerCase().includes(value.toLowerCase())
        );
        setManufacturerSuggestions([...new Set(filteredSuggestions)]);
      } else {
        setManufacturerSuggestions([]);
      }
    } else if (name === "model") {
      setModelInput(value);
      if (value) {
        const filteredSuggestions = models.filter((opt) =>
          opt.toLowerCase().includes(value.toLowerCase())
        );
        setModelSuggestions([...new Set(filteredSuggestions)]);
      } else {
        setModelSuggestions([]);
      }
    }
  };

  const handleSelect = (value: string, field: "manufacturer" | "model") => {
    if (field === "manufacturer") {
      setManufacturerInput(value);
    } else {
      setModelInput(value);
    }
    field === "manufacturer"
      ? setManufacturerSuggestions([])
      : setModelSuggestions([]);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        manufacturerSuggestionsRef.current &&
        !manufacturerSuggestionsRef.current.contains(event.target as Node) &&
        manufacturerInputRef.current &&
        !manufacturerInputRef.current.contains(event.target as Node)
      ) {
        setManufacturerSuggestions([]); // Close manufacturer suggestions when clicking outside
      }
      if (
        modelSuggestionsRef.current &&
        !modelSuggestionsRef.current.contains(event.target as Node) &&
        modelInputRef.current &&
        !modelInputRef.current.contains(event.target as Node)
      ) {
        setModelSuggestions([]); // Close model suggestions when clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitClicked(true);

    checkAnswer();

    setTimeout(() => {
      setSubmitClicked(false);
    }, 2000);

    //go to next slide after timeout
    if (currentIndex === synths.length - 1) {
      setGameOver(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (!submitClicked) return;

    updateSynthTimes(
      synths[currentIndex - 1].id,
      modelGuessed && manufacturerGuessed
    );
  }, [submitClicked]);

  //-------------------------------------------------- UTILITIES
  const checkAnswer = () => {
    if (manufacturerInput === synths[currentIndex].manufacturer) {
      setManufacturerGuessed(true);
      setScore((prev) => prev + 5);
    }
    if (modelInput === synths[currentIndex].model) {
      setModelGuessed(true);
      setScore((prev) => prev + 5);
    }
  };

  const resetValuesForSlide = () => {
    //clear inputs & suggestion arrays
    setManufacturerInput("");
    setModelInput("");
    setManufacturerSuggestions([]);
    setModelSuggestions([]);

    //guess states
    setManufacturerGuessed(false);
    setModelGuessed(false);

    //submit button
    setSubmitClicked(false);

    //counter
    setCounter(interval / 1000); // Reset counter
  };
  return (
    <div>
      <div className="flex justify-around p-2 bg-col-2 text-lg">
        <p>ID:{user}</p>
        <p>Score:{score}</p>
      </div>
      {!gameOver ? (
        <div>
          <h3 className="text-center text-xl font-bold mt-4 mb-2">
            Synth # {currentIndex + 1}
          </h3>
          <p className="text-center text-lg">
            {!submitClicked && `(${level})`}
          </p>
          <div className="max-h-xs w-auto p-2 ">
            <img
              src={`${IMGPATH}/images/${synths[currentIndex].image_url}`}
              alt={synths[currentIndex].image_url}
              className="border-2 border-col-3 rounded-md"
            />
          </div>
          <div
            className={`w-[60px] mx-auto border-3 rounded-4xl ${
              !submitClicked ? "border-col-error" : "border-gray-600"
            }`}
          >
            <p
              className={`text-center font-bold text-4xl ${
                !submitClicked ? "text-col-error" : "text-gray-600"
              }`}
            >
              {counter}
            </p>
          </div>
          <div className="flex flex-col mt-2">
            <h3 className="text-center text-xl font-bold">Guess:</h3>
            <form
              className="flex flex-col items-center"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-row justify-around gap-4">
                <div className="flex flex-col">
                  <label htmlFor="manufacturer" className="text-center">
                    Manufacturer:
                  </label>
                  <div className="relative">
                    {/* Add relative positioning to the parent div */}
                    <input
                      type="text"
                      autoComplete="off"
                      name="manufacturer"
                      className="bg-white w-[175px] p-2 border border-gray-300 rounded-md"
                      onChange={handleChange}
                      value={manufacturerInput}
                      ref={manufacturerInputRef} // Add ref for manufacturer input
                    />
                    {manufacturerSuggestions.length > 0 && (
                      <ul
                        ref={manufacturerSuggestionsRef} // Add ref for manufacturer suggestions
                        className="absolute w-[175px] bg-white border rounded mt-1 max-h-40 overflow-auto z-10"
                      >
                        {manufacturerSuggestions.map((item) => (
                          <li
                            key={item}
                            className="p-2 cursor-pointer hover:bg-gray-200"
                            onClick={() => handleSelect(item, "manufacturer")}
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <p
                    className={`text-center font-bold text-3xl mt-2 transition-all duration-500 ${
                      submitClicked
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    } ${
                      manufacturerGuessed ? "text-col-ok" : "text-col-error"
                    }`}
                  >
                    {manufacturerGuessed ? "+5" : "X"}
                  </p>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="model" className="text-center">
                    Model:
                  </label>
                  <div className="relative">
                    {/* Add relative positioning to the parent div */}
                    <input
                      type="text"
                      autoComplete="off"
                      name="model"
                      className="bg-white w-[175px] p-2 border border-gray-300 rounded-md"
                      onChange={handleChange}
                      value={modelInput}
                      ref={modelInputRef} // Add ref for model input
                    />
                    {modelSuggestions.length > 0 && (
                      <ul
                        ref={modelSuggestionsRef} // Add ref for model suggestions
                        className="absolute w-[175px] bg-white border rounded mt-1 max-h-40 overflow-auto z-10"
                      >
                        {modelSuggestions.map((item) => (
                          <li
                            key={item}
                            className="p-2 cursor-pointer hover:bg-gray-200"
                            onClick={() => handleSelect(item, "model")}
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <p
                    className={`text-center font-bold text-3xl mt-2 transition-all duration-500 ${
                      submitClicked
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    } ${modelGuessed ? "text-col-ok" : "text-col-error"}`}
                  >
                    {modelGuessed ? "+5" : "X"}
                  </p>
                </div>
              </div>
              <button
                type="submit"
                className={`my-4 p-2 border rounded-md w-[175px] font-semibold text-lg ${
                  submitClicked
                    ? "bg-col-disabled text-gray-500 cursor-not-allowed"
                    : "bg-col-4"
                }`}
                disabled={submitClicked}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      ) : (
        attemptStored && (
          <>
            <div className="bg-col-4 w-[200px] p-2 mx-auto flex flex-col mt-6 mb-6 text-xl border border-col-3 rounded-b-2xl">
              <p className="text-center">
                <strong>{user}</strong>, your score was:
              </p>
              <p className="text-center mt-2">
                <strong>{score}</strong> out of{" "}
                <strong>{synths.length * 10}</strong>
              </p>
            </div>
            <Leaderboard />
          </>
        )
      )}
    </div>
  );
};

export default SynthSlide;
