import { createRoot } from "react-dom/client";
import App from "./app/App"; // Sin extensión .tsx y ruta correcta
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(<App />);