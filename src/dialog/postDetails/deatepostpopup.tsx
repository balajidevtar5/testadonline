import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent, DialogContentText, DialogTitle
} from "@mui/material";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { LayoutContext } from "../../components/layout/LayoutContext";
import { colorMap } from "../../libs/constant";
import BounncePopup from "../animations/bouncepopup";
interface PostDetailsProps {
  open: boolean;
  handleOk?: (data?: any) => void,
  handleClose: (data?: any) => void;
  isEdit?: boolean;
  editPostData?: any;
  deleteMessage?: any;
  handleDeleteClick: (data?: any) => void;
  isLoading?:boolean;
}
const DeletePost = (props: PostDetailsProps) => {
  const { open, handleClose, deleteMessage, handleDeleteClick ,isLoading} = props
    const { isDarkMode } = useContext(LayoutContext);
  const {t} = useTranslation()
  return (
    <>
        <BounncePopup  open={open}
        onClose={handleClose}
        >
        <DialogTitle style={{ cursor: 'move', color: isDarkMode ? colorMap.white : colorMap.darkgray }} id="draggable-dialog-title">
          {t("General.Confirmation")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{color:isDarkMode && colorMap.white }}>
            {deleteMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button style={{ background: "red", color: "#fff", padding: "5px 8px", cursor: "ponter" }} autoFocus onClick={handleClose}>
            {t("General.No")}
          </Button>
          <Button style={{ background: "green", color: "#fff", padding: "5px 8px", cursor: "ponter" }} onClick={() => handleDeleteClick()}>{isLoading ? <CircularProgress size={20} color="inherit" /> : t("General.Yes")}</Button>
        </DialogActions>
        </BounncePopup>
    </>
  )
}

export default DeletePost
