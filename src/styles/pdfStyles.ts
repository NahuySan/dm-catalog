import { createTw } from "react-pdf-tailwind";

export const tw = createTw({
  theme: {
    extend: {
      colors: {
        primary: "#1f2937", // El gris oscuro de tu Header
        secondary: "#4b5563",
        accent: "#3b82f6",
      },
    },
  },
});