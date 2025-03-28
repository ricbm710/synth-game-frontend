export const checkLevel = (selected: number, guessed: number) => {
  const calc = guessed / selected;
  switch (true) {
    case calc <= 0.25:
      return "Very Hard";
    case calc <= 0.5:
      return "Hard";
    case calc <= 0.75:
      return "Easy";
    case calc <= 1:
      return "Very Easy";
    default:
      return "Not calculated";
  }
};
