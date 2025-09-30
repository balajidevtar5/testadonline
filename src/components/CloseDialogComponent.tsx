import { IconButton } from "@mui/material";
// import { CloseIcon } from "../assets/icons/CloseIcon";
import CloseIcon from "@mui/icons-material/Close";

interface CloseDialogComponentProps {
  handleClose: (data: any) => void;
  className?: any;
}
export const CloseDialogComponent = (props: CloseDialogComponentProps) => {
  const { handleClose, className } = props;
  return (
    <IconButton
      aria-label="close"
      onClick={handleClose}
      sx={{
        position: "absolute",
        right: 5,
        top: 20,
        color: (theme) => theme.palette.grey[500],
      }}
      className={className}
    >
      <CloseIcon width={14} height={14} />
    </IconButton>
  );
};
