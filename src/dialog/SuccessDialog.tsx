import { Dialog, DialogContent, Typography } from '@mui/material';
import { SuccessIcon } from '../assets/icons/SuccessIcon';
import { CloseDialogComponent } from '../components/CloseDialogComponent';
import { useTranslation } from 'react-i18next';

interface SuccessDialogProps {
    open: boolean;
    handleClose: (data?: any) => void;
}
const SuccessDialog = (props: SuccessDialogProps) => {
    const { open, handleClose } = props;
    const {t} = useTranslation();
    return (
        <Dialog
            onClose={handleClose}
            open={open}
            PaperProps={{
                className: "m-8 w-100"
            }}
            maxWidth='xs'
            fullWidth
        >
            <CloseDialogComponent handleClose={handleClose} />
            <DialogContent sx={{ p: "25px", textAlign: 'center' }}>
                <div>
                    <SuccessIcon />
                    <Typography sx={{ fontWeight: "600", color: "#1d8f28" }}>
                        {t("General.Congratulations!")}
                    </Typography>
                    <Typography sx={{ mt: "10px" }}>
                        {t("General.Your ad has been successfully posted. Our team will verify it shortly.")}
                    </Typography>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default SuccessDialog