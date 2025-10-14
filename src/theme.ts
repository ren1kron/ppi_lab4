import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#00e5ff" },
    secondary: { main: "#00c853" }
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: "none", borderRadius: 12 } } }
  }
});
