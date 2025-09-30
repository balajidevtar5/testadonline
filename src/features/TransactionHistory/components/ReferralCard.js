import React, { useRef, useContext } from "react";
import {
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
} from "@mui/material";
import { QrCode } from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import QRCode from "react-qr-code";
import { useTranslation } from "react-i18next";
import { useReferralShare } from "../../../features/Home/hooks/useSharePost";
import { LayoutContext } from "../../../components/layout/LayoutContext";
import { useSelector } from "react-redux";

export const ReferralCard = ({
  referralLink,
  setReferralLink,
  qrOpen,
  setQrOpen,
  copiedId,
  setCopiedId,
}) => {
  const { t } = useTranslation();
  const { isDarkMode } = useContext(LayoutContext);
  const qrRef = useRef(null);
  const { shareReferral, shareReferralWithQr } = useReferralShare();
  const { data: loginUserData } = useSelector((state) => state.loginUser);

  const handleClick = (e, action, value) => {
    e.stopPropagation();
    if (action === "copy") {
      navigator.clipboard.writeText(value);
      setCopiedId(value);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <Card sx={{ borderRadius: 3 }} className="mb-20">
      <CardContent>
        <Typography variant="h6" fontWeight={700} pt={0}>
          {t("General.Refer & Earn")}
        </Typography>
        <Typography variant="body2" mt={1} mb={2}>
          {t("General.Earn +500 points")}
        </Typography>
        {/* <Grid container spacing={1} alignItems="center" className="mb-15"> */}
        <div className="position-relative mb-15">
          <TextField
            id="outlined-basic"
            value={referralLink}
            variant="outlined"
            fullWidth
            onChange={(e) => setReferralLink(e.target.value)}
          />

          <Button
            variant="outlined"
            fullWidth
            className="copy-icon"
            onClick={(e) => handleClick(e, "copy", referralLink)}
          >
            {copiedId === referralLink ? (
              <CheckIcon
                className="mr-10 text-green"
                sx={{ fontSize: "20px" }}
              />
            ) : (
              <ContentCopyIcon
                className="mr-10 text-green"
                sx={{ fontSize: "20px" }}
              />
            )}
          </Button>
        </div>
        {/* </Grid> */}

        <Grid container spacing={1} className="mt-15">
          <Grid item xs={12}>
            <Button
              variant="contained"
              fullWidth
              onClick={() =>
                shareReferral(
                  referralLink,
                  loginUserData?.data[0]?.referralcode
                )
              }
            >
              {t("General.Share & Earn Now")}
            </Button>
          </Grid>
          {qrOpen && (
          <Grid item xs={6}>
            {/* <Button
              variant="outlined"
              fullWidth
              onClick={() => setQrOpen(true)}
              sx={{ bgcolor: "#fff", color: "#000" }}
            >
              <QrCode />
              QR Code
            </Button> */}
            
              <div className="text-center mt-10">
                <QRCode ref={qrRef} value={referralLink} size={160} />
                <Button
                  onClick={() => shareReferralWithQr(referralLink, qrRef)}
                  variant="contained"
                  className="mt-10"
                >
                  Share QR Code
                </Button>
              </div>
          
          </Grid>
            )}
        </Grid>
      </CardContent>
    </Card>
  );
};
