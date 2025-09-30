import React from 'react'
import { Close } from '@mui/icons-material';
import { Dialog, Grid } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear';
import { Button } from '@mui/base';
import textAd from "../assets/images/textAd.jpeg";
import { useTranslation } from 'react-i18next';
import SmoothPopup from '../dialog/animations/FancyAnimatedDialog';

const AdOptionDialog = (props: any) => {
    const { open, handleClose, setIsPutAdModalOpen, setIsPremiumAdModalOpen } = props;
    const { t } = useTranslation();
      
    return (
        <SmoothPopup
            onClose={handleClose}
            sx={{ m: '0px' }}
            open={open}
            fullWidth
            PaperProps={{
                className: "m-8 w-100 adOptionDialog"
            }}
        >
            <>
                {/* <div className="primary-bold"></div>
                <div className='d-flex align-items-center justify-content-between px-24 bg-lightPrimary sticky-header'>
                    <h3 className='mt-10 mb-10'><b>Ad Options</b></h3>
                </div> */}
                <div className='ad-option-dialog-close border-b-solid' style={{marginBottom:"10PX"}}>
                    <div onClick={handleClose} className='img-slider-close'> <ClearIcon /></div>
                </div>
                <div>
                <Grid container spacing={2} className='text-center mt-0 ml-0 w-100 '>
                    <Grid lg={6} md={6} sm={6} xs={6} className='border-r'>
                        <div className='image-container'>
                            <img src={textAd} alt="textAd" className='premium-image' />
                        </div>
                        <div className="ad-type-description">
                            {/* <p>{t("General.Text based Ad (FREE)*")} </p> */}
                        </div>
                        <div >
                        <Button   className='ad-btn adoptionbuttons mt-10' onClick={() => { setIsPutAdModalOpen(true); handleClose() }}>
                            📝{ t("General.Create Text Ad")}
                        </Button>
                        <div className='information-create'>
                          {t("General.*weekly one ad is free")}
                        </div>
                        </div>
                    </Grid>
                    <Grid lg={6} md={6} sm={6} xs={6} className='mt-xs-20'>
                        <div className='image-container'>
                            <img src="/temp4.png" alt="textAd" className='premium-image' />
                        </div>
                        <div className="ad-type-description">
                            {/* <p>{t("General.Upload an image")}</p> */}
                        </div>
                        <Button className='premiumAd-btn adoptionbuttons mt-10' onClick={() => { setIsPremiumAdModalOpen(true); handleClose() }}>
                            🖼️ {t("General.Premium AD")}
                        </Button>
                    </Grid>
                </Grid>
                </div>
            </>
        </SmoothPopup>
    )
}

export default AdOptionDialog