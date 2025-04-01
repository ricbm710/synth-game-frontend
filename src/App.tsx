//rrd
import { Route, Routes } from "react-router-dom";
//layout
import Layout from "./Layout";
//pages
import Home from "./pages/Home";
import Game from "./pages/Game";
import LeaderboardPage from "./pages/LeaderboardPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="*" element={<div>not found</div>} />
        <Route path="play" element={<Game />} />
        <Route path="leaderboard" element={<LeaderboardPage />} />
      </Route>
    </Routes>
  );
}

export default App;
