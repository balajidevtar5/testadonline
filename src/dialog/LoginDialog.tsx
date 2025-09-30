import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, Slide, Typography } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import React from 'react';
import { styled } from '@mui/material/styles';
import { CloseIcon } from '../assets/icons/CloseIcon';
import { CallIcon } from '../assets/icons/CallIcon';
import { VerifyIcon } from '../assets/icons/verifyIcon';
import { CloseDialogComponent } from '../components/CloseDialogComponent';
import LoginContainer from '../container/login/LoginContainer';
interface AdModalProps {
    open: boolean;
    handleClose: (data?: any, reason?: any) => void;
    handleOk: (data: any) => void;
}

const LoginDialog = (props: AdModalProps) => {
    const { open, handleClose, handleOk } = props;
    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title "
            open={open}
            sx={{ m: "0px" }}
            
            // PaperProps={{
            //     className: "m-8 w-100"
            // }}
        >
            {/* <DialogTitle sx={{ m: 0, p: 2, fontSize: "15px", fontWeight: "bold" }} id="customized-dialog-title">
                What is Lorem Ipsum?
            </DialogTitle> */}
            {/* <div className='img-slider-close p-0 close-icon'>
            <CloseDialogComponent  handleClose={handleClose} />
            </div> */}
            <DialogContent sx={{p:"0px"}}>
                <LoginContainer handleOk={handleOk} handleCloseDialog={handleClose} />
            </DialogContent>
        </Dialog>
    )
}

export default LoginDialog