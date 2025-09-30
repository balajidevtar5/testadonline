import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

export const BouncePopup = ({ open, onClose, title, content, onConfirm, confirmText, cancelText, isDarkMode }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText style={{ color: isDarkMode ? "#fff" : "#000" }}>
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          style={{
            background: "red",
            color: "#fff",
            padding: "5px 8px",
            cursor: "pointer",
          }}
          autoFocus
          onClick={onClose}
        >
          {cancelText}
        </Button>
        <Button
          style={{
            background: "green",
            color: "#fff",
            padding: "5px 8px",
            cursor: "pointer",
          }}
          onClick={onConfirm}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

