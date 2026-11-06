import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { registerSarmadServiceWorker } from "./registerSW";
import "./index.css";

registerSarmadServiceWorker();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
