import {
    Button,
    Dialog,
    DialogActions,
    DialogContent, DialogContentText, DialogTitle
  } from "@mui/material";
import { useTranslation } from "react-i18next";
  interface PostDetailsProps {
    open: boolean;
    handleOk?: (data?: any) => void,
    handleClose: (data?: any) => void;
    isEdit?: boolean;
    editPostData?: any;
    deleteMessage?: any;
    handleDeleteClick: (data?: any) => void;
  }
  const HideMeDialog = (props: PostDetailsProps) => {
    const { open, handleClose, handleOk, isEdit, editPostData, deleteMessage, handleDeleteClick } = props
  
    const {t} = useTranslation();
    return (
      <>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="draggable-dialog-title"
        >
          <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
            {t("General.Confirmation")}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {deleteMessage}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button style={{ background: "red", color: "#fff", padding: "5px 8px", cursor: "ponter" }} autoFocus onClick={handleClose}>
              {t("General.No")}
            </Button>
            <Button style={{ background: "green", color: "#fff", padding: "5px 8px", cursor: "ponter" }} onClick={() => handleDeleteClick()}>{t("General.Yes")}</Button>
          </DialogActions>
        </Dialog>
      </>
    )
  }
  
  export default HideMeDialog
  