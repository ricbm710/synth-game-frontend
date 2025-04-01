const Rules = () => {
  return (
    <div className="max-w-sm xl:max-w-6xl mx-auto bg-col-2 text-col-3 border border-col-3 rounded-md p-6">
      <h3 className="text-center text-lg font-bold mb-4">Rules:</h3>
      <ul className="space-y-3 list-disc list-inside">
        <li>Guess the name of vintage synths</li>
        <li>Number of synths: 10</li>
        <li>Time limit per synth: 10 secs</li>
        <li>Guessed Manufacturer: 5 points</li>
        <li>Guessed Model: 5 points</li>
      </ul>
    </div>
  );
};

export default Rules;
