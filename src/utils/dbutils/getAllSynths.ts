//types
import axios from "axios";
import { Synth } from "../../types/Synth";

export const getAllSynths = async (): Promise<Synth[]> => {
  try {
    const result = await axios.get("http://localhost:3000/api/synths");
    // Optionally, validate that the data is an array of Synth objects
    if (Array.isArray(result.data)) {
      return result.data as Synth[]; // Type assertion
    } else {
      throw new Error("Unexpected response format");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Axios error has a response property with status and data
      console.error("Backend Error:", error.response?.data?.error);
      // Optionally, you can handle the error further (e.g., display a notification)
    } else {
      // Other errors (network issues, etc.)
      console.error("Network Error:", error);
    }
    throw new Error("Unable to fetch synths data."); // Throw a generic error for the caller
  }
};
