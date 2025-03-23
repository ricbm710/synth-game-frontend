import React, { ChangeEvent, useState } from "react";
//rrd
import { useNavigate } from "react-router-dom";
//components
import Rules from "../components/Rules";

const Home = () => {
  //user state
  const [user, setUser] = useState<string>(
    () => localStorage.getItem("user") || ""
  );

  //letter count error
  const [inputError, setInputError] = useState<boolean>(false);
  //max letter count
  const MAX_LETTERS = 20;

  //change event
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Remove spaces from the input if any
    const inputWithoutSpaces = inputValue.replace(/\s/g, "");

    // Count the number of letters (characters)
    const letterCount = inputWithoutSpaces.length;

    // Only update state if the letter count is less than or equal to MAX_LETTERS
    if (letterCount <= MAX_LETTERS) {
      setUser(inputWithoutSpaces); // Store input without spaces
      setInputError(false);
    } else {
      setInputError(true);
    }
  };

  //navigation
  const navigate = useNavigate();

  //submit event
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    //prevents page reload
    e.preventDefault();
    //stores in LocalStorage
    localStorage.setItem("user", user);
    //redirects to Game component
    navigate("play");
  };

  return (
    <div className="pt-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center text-lg mb-2"
      >
        <label htmlFor="user" className="p-2 font-bold">
          Enter your ID:
        </label>
        <input
          type="text"
          name="user"
          value={user}
          onChange={handleChange}
          placeholder="some_user_1"
          className="bg-white w-[200px] p-2 border border-gray-300 rounded-md"
        />
        <p
          className="text-col-error text-sm p-2"
          hidden={!inputError}
        >{`* Reached max character limit (${MAX_LETTERS})`}</p>
        <button
          type="submit"
          className={`my-4 p-2 border rounded-md ${
            user === ""
              ? "bg-col-disabled text-gray-500 cursor-not-allowed"
              : "bg-col-4"
          }`}
          disabled={user === ""}
        >
          Start Game
        </button>
      </form>
      <Rules />
    </div>
  );
};

export default Home;
