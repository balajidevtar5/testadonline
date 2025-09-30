import { colors } from "@mui/material";
import { createTheme } from "@mui/material/styles";
export const THEMES = {
  LIGHT: "LIGHT",
  ONE_DARK: "ONE_DARK",
};
export const MAIN_COLOR = "#ff780c";

const themesOptions = [
  {
    name: THEMES.LIGHT,
    palette: {
      type: "light",
      action: {
        active: colors.blueGrey[600],
      },
      background: {
        default: colors.common.white,
        dark: "#f4f6f8",
        darker: "#efefef",
        paper: colors.common.white,
        grey: "#80808052",
      },
      primary: {
        main: MAIN_COLOR,
      },
      secondary: {
        main: "#d9534f",
      },
    },
    typography: {
      body1: {
        fontFamily: 'Poppins, sans-serif',
        fontWeight: "400",
        fontSize: "15px",
        color: "#3C444B"
      },
      body2: {
        fontFamily: 'Poppins, sans-serif',
        fontSize: "14px",
      },
      h1: {
        fontWeight: 800,
        fontFamily: 'Poppins, sans-serif',
      },
      h4: {
        fontWeight: 800,
        marginBottom: "8px",
        fontFamily: 'Poppins, sans-serif',
      },
      h5: {
        fontWeight: 600,
        fontFamily: 'Poppins, sans-serif',
      },
      h6: { fontWeight: 700, fontFamily: 'Poppins, sans-serif' },
      subtitle1: {
        fontWeight: 700,
        fontFamily: 'Poppins, sans-serif',
        fontSize: "16px",
      },
      subtitle2: {
        fontWeight: 700,
        fontSize: "13px",
        fontFamily: 'Poppins, sans-serif',
      },
      caption: {
        fontWeight: 800,
        fontSize: "16px",
        marginBottom: "10px",
        fontFamily: 'Poppins, sans-serif',
      },
    },
    components: {
      // Name of the component
      MuiButton: {
        styleOverrides: {
          // Name of the slot
          root: {
            // Some CSS
            color: "#fff",
            paddingTop: "8px",
            background: MAIN_COLOR,
          },
          text: {
            // color:"#252525",
            color: "#fff",
            background: "none"
          },
        },

      },
      MuiSvgIcon: {
        styleOverrides: {
          // Name of the slot
          root: {
            // Some CSS
            color: MAIN_COLOR,
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          // Name of the slot
          root: {
            // Some CSS
            color: MAIN_COLOR,
            top: "-7px",
            "&.MuiFormLabel-filled, &.Mui-focused": {
              top: 0,
            },
          },
          shrink: {
            top: 0,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          // Name of the slot
          notchedOutline: {
            // Some CSS
            borderColor: MAIN_COLOR,
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          // Name of the slot
          root: {
            // Some CSS
            backgroundColor: MAIN_COLOR,
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          // Name of the slot
          root: {
            // Some CSS
            minHeight: "38.5px",
            "& .MuiInputBase-input": {
              padding: "7px 14px",
            },
          },
        },
      },

      MuiAutocomplete: {
        styleOverrides: {
          // Name of the slot
          inputRoot: {
            // Some CSS
            padding: 0,
            paddingLeft: "5px",
          },
          tag: {
            // Some CSS
            height: "25px",
          },
          noOptions: {
            // Some CSS
            color: "#757575",
          },
        },
      },

      MuiFormHelperText: {
        styleOverrides: {
          // Name of the slot
          root: {
            // Some CSS
            fontWeight: "normal",
            margin: 0,
          },
        },
      },

      // color white for selected page on pagination
      MuiPaginationItem: {
        styleOverrides: {
          // Name of the slot
          root: {
            "&.Mui-selected": {
              color: "#FFFFFF",
            },
          },
        },
      },
    },
  },
];

const Theme = createTheme(themesOptions[0]);
export default Theme;
