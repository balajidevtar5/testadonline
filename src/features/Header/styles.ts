import { styled } from "@mui/material/styles";
import { Paper } from "@mui/material";

interface AnimatedSearchBoxProps {
  open: boolean;
}

export const AnimatedSearchBox = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "open",
})<AnimatedSearchBoxProps>(({ open }) => ({
  display: "flex",
  alignItems: "center",
  width: open ? "calc(100% - 30px)" : 0,
  transition: "width 0.3s ease",
  overflow: "hidden",
  marginLeft: "8px",
  padding: open ? "0 8px" : 0,
  position: "relative",
  zIndex: 1000,
  backgroundColor: "transparent",
  boxShadow: "none",
  "& .MuiInputBase-root": {
    width: "100%",
    backgroundColor: "transparent",
  },
  "& .MuiInputBase-input": {
    padding: "8px 0",
  },
  "@media (max-width: 768px)": {
    width: open ? "100%" : 0,
    marginLeft: 0,
    padding: open ? "8px" : 0,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "var(--background-color, #fff)",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    "& .MuiInputBase-root": {
      backgroundColor: "transparent",
    },
  },
})); 