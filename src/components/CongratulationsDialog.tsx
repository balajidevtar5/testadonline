import React from "react";
import { Dialog, DialogContent, Typography, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Trans, useTranslation } from 'react-i18next';
import  congrats  from "../assets/images/congrats.png"

interface CongratulationsDialogProps {
  open: boolean;
  onClose: () => void;
}

const CongratulationsDialog: React.FC<CongratulationsDialogProps> = ({ open, onClose }) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{
      style: {
        borderRadius: 16,
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        background: 'linear-gradient(135deg, #ff512f 0%, #dd2476 100%)',
        overflow: 'visible',
      }
    }}>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: '#fff',
          zIndex: 1,
        }}
        size="large"
      >
        <CloseIcon />
      </IconButton>
      <DialogContent style={{ textAlign: "center", padding: "40px 16px 32px 16px", position: 'relative' }}>
        <Box mb={2}>
          <img
            src={congrats}
            alt="Celebration"
            style={{ width: 80, height: 80 }}
          />
        </Box>
        <Typography variant="h5" gutterBottom sx={{ color: '#fff', fontWeight: 700 }}>
          {t("General.Congratulations")}
        </Typography>
        <Typography variant="body2" gutterBottom sx={{ color: '#fff', opacity: 0.9, textAlign: 'center' }}>
          <div style={{ whiteSpace: 'pre-line' }}>
            <Trans
              i18nKey="General.EarnedPointsMessage"
              components={{
                highlight: <Box component="span" sx={{ fontWeight: 700, color: '#ffe066' }} />
              }}
            />
          </div>
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default CongratulationsDialog; 