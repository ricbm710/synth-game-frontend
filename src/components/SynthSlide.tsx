import { useEffect, useRef, useState } from "react";
//types
import { Synth } from "../types/Synth";

interface SyntSlideProps {
  synths: Synth[];
  interval: number;
  manufacturers: Synth["manufacturer"][];
  models: Synth["model"][];
}

const SynthSlide = ({
  synths,
  interval,
  manufacturers,
  models,
}: SyntSlideProps) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState<number>(0);

  //autocomplete feature
  const [manufacturerInput, setManufacturerInput] = useState<string>(""); // for manufacturer input
  const [modelInput, setModelInput] = useState<string>(""); // for model input
  const [isValid, setIsValid] = useState<boolean>(false);
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

  const user = localStorage.getItem("user");

  useEffect(() => {
    //clear autocomplete
    setManufacturerInput("");
    setModelInput("");
    setManufacturerSuggestions([]);
    setModelSuggestions([]);
    setIsValid(false);

    if (currentIndex + 1 >= synths.length) {
      setGameOver(true);
      return; //stop timer
    }
    const timer = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, interval);
    return () => clearInterval(timer);
  }, [currentIndex]);

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
      setIsValid(manufacturers.includes(value));
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
      setIsValid(true);
    } else {
      setModelInput(value);
    }
    field === "manufacturer"
      ? setManufacturerSuggestions([])
      : setModelSuggestions([]);
  };

  // Handle click outside to close suggestions
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
              <div className="relative">
                {" "}
                {/* Add relative positioning to the parent div */}
                <input
                  type="text"
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
            </div>
            <div className="flex flex-col">
              <label htmlFor="model" className="text-center">
                Model:
              </label>
              <div className="relative">
                {" "}
                {/* Add relative positioning to the parent div */}
                <input
                  type="text"
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
