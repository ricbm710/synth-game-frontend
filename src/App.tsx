//rrd
import { Route, Routes } from "react-router-dom";
//layout
import Layout from "./Layout";
//pages
import Home from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="*" element={<div>not found</div>} />
      </Route>
    </Routes>
  );
}

export default App;
