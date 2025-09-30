import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import { Dialog, DialogActions, DialogContent, IconButton, Typography } from '@mui/material';
import { CloseDialogComponent } from '../components/CloseDialogComponent';
import Button from '@mui/material/Button';
import { MAIN_COLOR } from '../config/theme';
interface AdModalProps {
    open: boolean;
    shareImageBase64: any,
    handleClose: () => void;
}

const ShareDialog = (props: AdModalProps) => {
    const { open, handleClose, shareImageBase64 } = props;
    const handleClick = () => {
        const byteCharacters = atob(shareImageBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters?.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob: any = new Blob([byteArray], { type: 'image/png' });
        const file = new File([blob], 'image.png', { type: 'image/png' });
        if (navigator.share) {
            navigator.share({
                files: [file],
            })
                .then(() => {
                    //console.log('Shared successfully');
                    // handleClose()
                })
                .catch((error) => console.error('Error sharing:', error));
        } else {
            //console.log('Web Share API not supported');
        }
    }

    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            sx={{ m: "0px" }}
            className='postDialog'
            maxWidth="xs"
        >
            {/* <DialogTitle sx={{ m: 0, p: 2, fontSize: "15px", fontWeight: "bold" }} id="customized-dialog-title">
                What is Lorem Ipsum?
            </DialogTitle> */}
            <CloseDialogComponent handleClose={handleClose} />
            <DialogContent sx={{ p: "10px" }}>
                {/* <Typography sx={{ fontWeight: "600" }}>
                    What is Lorem Ipsum?
                </Typography> */}
                <Typography overflow={'none'} gutterBottom sx={{ pt: "10px" }} variant='body2' className='pt-0 mb-0'>
                    <span className="x"><img className='shareimg' src={`data:image/png;base64,${shareImageBase64}`} /></span>
                </Typography>
            </DialogContent>
            <DialogActions>
                <div onClick={handleClick} className='share-dialog '>
                    <Button variant="contained" className='text-white' startIcon={<ShareOutlinedIcon />}>
                        share
                    </Button>
                    {/* <IconButton sx={{ width: "20px", height: "20px", borderRadius: "50%", color: MAIN_COLOR }}>
                            <ShareOutlinedIcon />  
                        </IconButton> */}
                    {/* <div style={{ fontSize: "13px" }}>
                    share
                    </div> */}
                </div>
                <Button variant="outlined" color='error' onClick={handleClose} className='close-btn'>Close</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ShareDialog