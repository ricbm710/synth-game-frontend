import { useEffect, useRef, useState } from "react";
//types
import { Synth } from "../types/Synth";
//utils
import { checkLevel } from "../utils/miscutils/checkLevel";
import { updateSynthTimes } from "../utils/dbutils/updateSynthTimes";
import { createAttempt } from "../utils/dbutils/createAttempt";
//components
import Leaderboard from "./Leaderboard";

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

  const [manufacturerInput, setManufacturerInput] = useState<string>("");
  const [modelInput, setModelInput] = useState<string>("");

  //autocomplete states
  const [manufacturerSuggestions, setManufacturerSuggestions] = useState<
    string[]
  >([]);
  const [modelSuggestions, setModelSuggestions] = useState<string[]>([]);

  // Create refs for input and suggestion lists
  const manufacturerInputRef = useRef<HTMLInputElement | null>(null);
  const modelInputRef = useRef<HTMLInputElement | null>(null);
  const manufacturerSuggestionsRef = useRef<HTMLUListElement | null>(null);
  const modelSuggestionsRef = useRef<HTMLUListElement | null>(null);

  const [manufacturerGuessed, setManufacturerGuessed] =
    useState<boolean>(false);
  const [modelGuessed, setModelGuessed] = useState<boolean>(false);

  const [attemptStored, setAttemptStored] = useState(false);

  //*--------------------------------------------------------------------------->
  useEffect(() => {
    //store attempt
    if (gameOver) {
      const createAttemptCaller = async () => {
        try {
          await createAttempt(user!, score);
          setAttemptStored(true);
        } catch (error: any) {
          console.error(
            "Error occurred while creating attempt:",
            error.message
          );
        }
      };
      createAttemptCaller();
    }

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
    clearValues();

    const countDown = setInterval(() => {
      setCounter((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else {
          return prev;
        }
      });
    }, 1000);

    const sliderTimer = setTimeout(() => {
      if (currentIndex + 1 < synths.length) {
        setRoundOver(false);
        setCurrentIndex((prev) => prev + 1);
      } else {
        setGameOver(true);
      }
    }, interval + 1500);

    return () => {
      clearTimeout(sliderTimer);
      clearInterval(countDown);
    };
  }, [currentIndex, roundOver, gameOver]);

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

  useEffect(() => {
    if (counter === 0 || roundOver) {
      updateSynthTimes(
        synths[currentIndex].id,
        modelGuessed && manufacturerGuessed
      );
      if (counter === 0) {
        checkAnswer();
      }
    }
  }, [roundOver, counter]);

  //*--------------------------------------------------------------------------->

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setRoundOver(true);

    checkAnswer();

    setTimeout(() => {
      if (currentIndex + 1 < synths.length) {
        setCurrentIndex((prev) => prev + 1);
        setRoundOver(false);
      } else {
        setGameOver(true);
      }
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevents the default behavior to stop form submission from happening twice
      const form = e.currentTarget.closest("form") as HTMLFormElement;
      form?.requestSubmit(); // Triggers form submission with validation
    }
  };

  //*--------------------------------------------------------------------------->

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

  const clearValues = () => {
    //clear inputs & suggestion arrays
    setManufacturerInput("");
    setModelInput("");
    setManufacturerSuggestions([]);
    setModelSuggestions([]);

    //guess states
    setManufacturerGuessed(false);
    setModelGuessed(false);
  };

  return (
    <div>
      <div className="flex justify-around p-2 bg-col-2 text-lg md:text-xl">
        <p>ID:{user}</p>
        <p>Score:{score}</p>
      </div>
      {!gameOver ? (
        <div>
          <h3 className="text-center text-xl font-bold mt-4 mb-2">
            Synth #{currentIndex + 1} ({level})
          </h3>
          <div className="flex flex-col md:flex-row md:gap-6 justify-center items-center p-4">
            <div>
              <div className="max-h-[300px] md:max-h-[400px] lg:max-h-[450px] xl:max-h-[500px] w-auto p-2 flex justify-center items-center overflow-hidden">
                <img
                  src={`${IMGPATH}/images/${synths[
                    currentIndex
                  ].manufacturer.toLowerCase()}/${
                    synths[currentIndex].image_url
                  }`}
                  alt={synths[currentIndex].image_url}
                  className="object-contain max-h-full w-auto border-2 border-col-3 rounded-md"
                />
              </div>
              {(roundOver || counter === 0) && (
                <p className="text-center text-lg mb-2">
                  {synths[currentIndex].manufacturer} -{" "}
                  {synths[currentIndex].model}
                </p>
              )}
              <div
                className={`w-[60px] mx-auto border-3 rounded-4xl ${
                  !roundOver && counter > 0
                    ? "border-col-error"
                    : "border-gray-600"
                }`}
              >
                <p
                  className={`text-center font-bold text-4xl ${
                    !roundOver && counter > 0
                      ? "text-col-error"
                      : "text-gray-600"
                  }`}
                >
                  {counter}
                </p>
              </div>
            </div>
            <div>
              <form
                className="flex flex-col items-center md:gap-12"
                onSubmit={handleSubmit}
                onKeyDown={handleKeyPress}
              >
                <div className="flex flex-row justify-around gap-4 md:gap-8">
                  <div className="flex flex-col">
                    <label
                      htmlFor="manufacturer"
                      className="text-center md:text-xl p-2"
                    >
                      Manufacturer:
                    </label>
                    <div className="relative">
                      {/* Add relative positioning to the parent div */}
                      {/* --------------------------------------------------------> Manufacturer Input */}
                      <input
                        type="text"
                        autoComplete="off"
                        name="manufacturer"
                        className={`w-[175px] sm:w-[175px] md:w-[250px] p-2 border border-gray-300 rounded-md ${
                          roundOver || counter === 0
                            ? "bg-col-disabled"
                            : "bg-white"
                        } `}
                        onChange={handleChange}
                        value={manufacturerInput}
                        ref={manufacturerInputRef} // Add ref for manufacturer input
                        disabled={roundOver || counter === 0}
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
                    {(roundOver || counter === 0) && (
                      <p
                        className={`text-center font-bold text-3xl mt-2 transition-all duration-500 ${
                          roundOver || counter === 0
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4"
                        } ${
                          manufacturerGuessed ? "text-col-ok" : "text-col-error"
                        }`}
                      >
                        {manufacturerGuessed ? "+5" : "X"}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="model"
                      className="text-center md:text-xl p-2"
                    >
                      Model:
                    </label>
                    <div className="relative">
                      {/* Add relative positioning to the parent div */}
                      {/* --------------------------------------------------------> Model Input */}
                      <input
                        type="text"
                        autoComplete="off"
                        name="model"
                        className={`w-[175px] sm:w-[175px] md:w-[250px] p-2 border border-gray-300 rounded-md ${
                          roundOver || counter === 0
                            ? "bg-col-disabled"
                            : "bg-white"
                        } `}
                        onChange={handleChange}
                        value={modelInput}
                        ref={modelInputRef} // Add ref for model input
                        disabled={roundOver || counter === 0}
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
                    {(roundOver || counter === 0) && (
                      <p
                        className={`text-center font-bold text-3xl mt-2 transition-all duration-500 ${
                          roundOver || counter === 0
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4"
                        } ${modelGuessed ? "text-col-ok" : "text-col-error"}`}
                      >
                        {modelGuessed ? "+5" : "X"}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className={`p-2 mt-4 border rounded-md w-[175px] font-semibold text-lg ${
                    roundOver || counter === 0
                      ? "bg-col-disabled text-gray-500 cursor-not-allowed"
                      : "bg-col-4"
                  }`}
                  disabled={roundOver || counter === 0}
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        attemptStored && (
          // if game over & attempt stored
          <>
            <div className="bg-col-4 w-[175px] p-2 mx-auto flex flex-col mt-6 text-xl border border-col-3 rounded-b-2xl">
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

export default SynthSlider;
