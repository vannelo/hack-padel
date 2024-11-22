import { createTheme } from "@mui/material/styles";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const theme = createTheme({
  typography: {
    fontFamily: inter.style.fontFamily,
    h6: {
      fontSize: "1.5rem",
      fontWeight: 700,
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
    },
  },
  palette: {
    primary: {
      main: "#c0ff00",
    },
    secondary: {
      main: "#4c4c4c",
    },
  },
});

export default theme;
