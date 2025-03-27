import axios from "axios";

export const updateSynthTimes = async (id: number, guessed: boolean) => {
  try {
    await axios.patch(`http://localhost:3000/api/synths/${id}/stats`, {
      guessed,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Axios error has a response property with status and data
      console.error("Backend Error:", error.response?.data?.error);
      // Optionally, you can handle the error further (e.g., display a notification)
    } else {
      // Other errors (network issues, etc.)
      console.error("Network Error:", error);
    }
    throw new Error("Unable to update synth times."); // Throw a generic error for the caller
  }
};
