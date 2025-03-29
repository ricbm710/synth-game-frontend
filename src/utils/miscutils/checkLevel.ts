export const checkLevel = (selected: number, guessed: number) => {
  const calc = guessed / selected;
  switch (true) {
    case calc <= 0.2:
      return "Very Hard";
    case calc <= 0.4:
      return "Hard";
    case calc <= 0.6:
      return "Normal";
    case calc <= 0.8:
      return "Easy";
    case calc <= 1:
      return "Very Easy";
    default:
      return "Not calculated";
  }
};
