import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
//rrd
import { BrowserRouter } from "react-router-dom";
//app
import App from "./App";
//tailwind
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.VITE_BASE_PATH}>
      <App />
    </BrowserRouter>
  </StrictMode>
);
