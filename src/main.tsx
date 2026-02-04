import { Buffer } from 'buffer'; // <--- Nuevo: Importamos el polyfill
import { createRoot } from "react-dom/client";
import App from "./app/App"; 
import "./styles/index.css";

// Definimos Buffer globalmente para que react-pdf lo encuentre
if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || Buffer;
}

createRoot(document.getElementById("root")!).render(<App />);