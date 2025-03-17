const Rules = () => {
  return (
    <div className="max-w-sm mx-auto bg-col-2 text-col-3 border border-col-3 rounded-md p-6">
      <h3 className="text-center text-lg font-bold mb-4">Rules:</h3>
      <ul className="space-y-3 list-disc list-inside">
        <li>Guess the name of vintage synths by their pictures.</li>
        <li>
          <span className="font-semibold">Number of randomized synths:</span> 10
        </li>
        <li>
          <span className="font-semibold">Time limit per synth:</span> 10 secs
        </li>
        <li>
          <span className="font-semibold">Guessing Manufacturer:</span> 5 points
        </li>
        <li>
          <span className="font-semibold">Guessing Model:</span> 5 points
        </li>
      </ul>
    </div>
  );
};

export default Rules;
