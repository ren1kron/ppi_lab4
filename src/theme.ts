import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00ff41", // Матричный зелёный
      light: "#66ff66",
      dark: "#00cc33"
    },
    secondary: {
      main: "#00e5ff", // Кибери-голубой
      light: "#66ffff",
      dark: "#00b3cc"
    },
    error: {
      main: "#ff1744", // Красный для ошибок
    },
    warning: {
      main: "#ff9100", // Оранжевый для предупреждений
    },
    background: {
      default: "#0a0a0a",
      paper: "#1a1a1a"
    },
    text: {
      primary: "#ffffff",
      secondary: "#b3b3b3"
    }
  },
  typography: {
    fontFamily: "'Share Tech Mono', monospace",
    h1: {
      fontFamily: "'Orbitron', sans-serif",
      fontWeight: 900,
      fontSize: "2.5rem",
      letterSpacing: "0.2em",
      textTransform: "uppercase"
    },
    h2: {
      fontFamily: "'Orbitron', sans-serif",
      fontWeight: 700,
      fontSize: "2rem",
      letterSpacing: "0.15em"
    },
    h3: {
      fontFamily: "'Orbitron', sans-serif",
      fontWeight: 600,
      fontSize: "1.75rem",
      letterSpacing: "0.1em"
    },
    h4: {
      fontFamily: "'Orbitron', sans-serif",
      fontWeight: 500,
      fontSize: "1.5rem",
      letterSpacing: "0.05em"
    },
    h5: {
      fontFamily: "'Rajdhani', sans-serif",
      fontWeight: 600,
      fontSize: "1.25rem",
      letterSpacing: "0.05em"
    },
    h6: {
      fontFamily: "'Rajdhani', sans-serif",
      fontWeight: 500,
      fontSize: "1.1rem"
    },
    body1: {
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: "0.9rem"
    },
    body2: {
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: "0.8rem"
    },
    button: {
      fontFamily: "'Rajdhani', sans-serif",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.1em"
    }
  },
  shape: {
    borderRadius: 4
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "linear-gradient(45deg, #0a0a0a 0%, #1a1a1a 100%)",
          minHeight: "100vh",
          "&::before": {
            content: '""',
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"matrix\" x=\"0\" y=\"0\" width=\"20\" height=\"20\" patternUnits=\"userSpaceOnUse\"><text x=\"0\" y=\"15\" fill=\"rgba(0,255,65,0.03)\" font-family=\"monospace\" font-size=\"12\">01</text></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23matrix)\"/></svg>')",
            opacity: 0.3,
            zIndex: -1,
            animation: "matrixScroll 20s linear infinite"
          }
        },
        "@keyframes matrixScroll": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 100%" }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "linear-gradient(90deg, #001a00 0%, #003300 100%)",
          borderBottom: "2px solid #00ff41",
          boxShadow: "0 0 30px rgba(0, 255, 65, 0.5)",
          backdropFilter: "blur(10px)"
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: "linear-gradient(180deg, #001a00 0%, #000d00 100%)",
          borderRight: "2px solid #00ff41",
          boxShadow: "0 0 20px rgba(0, 255, 65, 0.3)"
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%)",
          border: "1px solid #333",
          boxShadow: `
            0 4px 20px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
          backdropFilter: "blur(10px)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: "linear-gradient(90deg, transparent, #00ff41, transparent)",
            animation: "scanLine 3s linear infinite"
          },
          "&:hover": {
            borderColor: "#00ff41",
            boxShadow: "0 4px 25px rgba(0, 255, 65, 0.4)"
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "uppercase",
          fontWeight: 600,
          borderRadius: 4,
          transition: "all 0.3s ease",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: "-100%",
            width: "100%",
            height: "100%",
            background: "linear-gradient(90deg, transparent, rgba(0, 255, 65, 0.4), transparent)",
            transition: "left 0.5s"
          },
          "&:hover::before": {
            left: "100%"
          },
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 5px 15px rgba(0, 255, 65, 0.4)"
          }
        },
        contained: {
          background: "linear-gradient(45deg, #00ff41 0%, #00e5ff 100%)",
          color: "#000",
          fontWeight: 700,
          "&:hover": {
            background: "linear-gradient(45deg, #00e5ff 0%, #00ff41 100%)"
          }
        },
        outlined: {
          border: "2px solid #00ff41",
          color: "#00ff41",
          background: "rgba(0, 255, 65, 0.05)",
          "&:hover": {
            borderColor: "#00e5ff",
            backgroundColor: "rgba(0, 229, 255, 0.1)",
            boxShadow: "0 0 15px rgba(0, 229, 255, 0.3)"
          }
        },
        text: {
          color: "#00ff41",
          "&:hover": {
            backgroundColor: "rgba(0, 255, 65, 0.1)",
            boxShadow: "0 0 10px rgba(0, 255, 65, 0.2)"
          }
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderLeft: "3px solid transparent",
          margin: "2px 8px",
          borderRadius: "4px",
          "&.Mui-selected": {
            background: "linear-gradient(90deg, rgba(0, 255, 65, 0.2) 0%, rgba(0, 255, 65, 0.1) 100%)",
            color: "#00ff41",
            fontWeight: 600,
            borderLeft: "3px solid #00ff41",
            "&::before": {
              content: '">"',
              position: "absolute",
              left: "8px",
              color: "#00ff41",
              fontWeight: "bold"
            }
          },
          "&:hover": {
            background: "rgba(0, 255, 65, 0.1)",
            borderLeft: "3px solid #00ff41"
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            fontFamily: "'Share Tech Mono', monospace",
            "& fieldset": {
              borderColor: "#00ff41",
              borderWidth: "2px"
            },
            "&:hover fieldset": {
              borderColor: "#00e5ff",
              boxShadow: "0 0 10px rgba(0, 229, 255, 0.3)"
            },
            "&.Mui-focused fieldset": {
              borderColor: "#00e5ff",
              boxShadow: "0 0 15px rgba(0, 229, 255, 0.5)"
            }
          }
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          fontFamily: "'Share Tech Mono', monospace",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#00ff41",
            borderWidth: "2px"
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#00e5ff",
            boxShadow: "0 0 10px rgba(0, 229, 255, 0.3)"
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#00e5ff",
            boxShadow: "0 0 15px rgba(0, 229, 255, 0.5)"
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: "'Share Tech Mono', monospace",
          fontWeight: 600,
          "&.MuiChip-outlined": {
            borderWidth: "2px"
          }
        }
      }
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          fontFamily: "'Share Tech Mono', monospace",
          border: "2px solid",
          "& .MuiAlert-icon": {
            fontSize: "1.5rem"
          }
        },
        filledError: {
          background: "linear-gradient(45deg, #d32f2f 0%, #f44336 100%)",
          borderColor: "#ff5252"
        },
        filledWarning: {
          background: "linear-gradient(45deg, #ff6f00 0%, #ff9100 100%)",
          borderColor: "#ffb300"
        },
        filledInfo: {
          background: "linear-gradient(45deg, #0066cc 0%, #0099ff 100%)",
          borderColor: "#00e5ff"
        },
        filledSuccess: {
          background: "linear-gradient(45deg, #00c853 0%, #00ff41 100%)",
          borderColor: "#66ff66"
        }
      }
    }
  }
});