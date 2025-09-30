import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup
} from "@mui/material";

export default function ShareDialogSelection({ open, onClose, onShare }) {
  const [shareOption, setShareOption] = useState("");

  const handleChange = (event) => {
    const value = event.target.value;
    setShareOption(value);
    onShare(event,value); // perform share immediately
    onClose();      // close dialog
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Choose Share Option</DialogTitle>
      <DialogContent>
        <FormControl component="fieldset">
          <RadioGroup value={shareOption} onChange={handleChange}>
            <FormControlLabel
              value="withImage"
              control={<Radio />}
              label="Share with Image"
            />
            <FormControlLabel
              value="withoutImage"
              control={<Radio />}
              label="Share without Image"
            />
          </RadioGroup>
        </FormControl>
      </DialogContent>
    </Dialog>
  );
}
