import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Slide, Typography } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import React from 'react';
import { styled } from '@mui/material/styles';
import { CloseIcon } from '../assets/icons/CloseIcon';
import { CallIcon } from '../assets/icons/CallIcon';
import { VerifyIcon } from '../assets/icons/verifyIcon';
import { CloseDialogComponent } from '../components/CloseDialogComponent';
interface AdModalProps {
    open: boolean;
    handleClose: (data: any) => void;
}

const AdvertiseDetailsDialog = (props: AdModalProps) => {
    const { open, handleClose } = props;
    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            sx={{ m: "0px" }}
            PaperProps={{
                className: "m-8 w-100"
            }}
        >
            {/* <DialogTitle sx={{ m: 0, p: 2, fontSize: "15px", fontWeight: "bold" }} id="customized-dialog-title">
                What is Lorem Ipsum?
            </DialogTitle> */}
            <CloseDialogComponent handleClose={handleClose} />
            <DialogContent sx={{ p: "25px", pt: "42px" }}>
                <Typography sx={{ fontWeight: "600" }}>
                    What is Lorem Ipsum?
                </Typography>
                <Typography gutterBottom sx={{ pt: "10px" }} variant='body2'>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard
                    dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type
                </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "start", p: "0 25px 25px" }}>
                <IconButton sx={{ background: "#3C444B", width: "30px", height: "30px", borderRadius: "50%" }}>
                    <CallIcon />
                </IconButton>
                <Typography sx={{ mr: "10px" }}>+91 9874563210</Typography>
                <Typography sx={{ fontWeight: "600" }}>John C. Jordan</Typography>
                <VerifyIcon />
            </DialogActions>
        </Dialog>
    )
}

export default AdvertiseDetailsDialog