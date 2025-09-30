import React from 'react';
import { Tooltip, Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import StarsIcon from '@mui/icons-material/Stars';

interface PrizeDistributionProps {
    item: any;
    tooltipOpen: string | number | null;
    handleTooltipOpen: (id: string | number) => void;
    handleTooltipClose: () => void;
    isLoading: boolean;
    slotData: Array<{ isadfree: number }>;
    highLightAmount: number;
    showPlusIcon?: string;
}

const PrizeDistribution: React.FC<PrizeDistributionProps> = ({
    item,
    tooltipOpen,
    handleTooltipOpen,
    handleTooltipClose,
    isLoading,
    slotData,
    highLightAmount,
    showPlusIcon
}) => {
    const { t } = useTranslation();

    

    return (
        <>
            <div className='d-flex justify-content-between mt-10' key={item?.id}>
                <span className='justify-content-start d-flex align-items-center text-grey font-13'>
                    {item?.name}
                    <Tooltip 
                        open={tooltipOpen === item?.id} 
                        onClose={handleTooltipClose} 
                        placement='bottom' 
                        arrow={true} 
                        title={
                            <span style={{ fontSize: '0.7rem' }}>
                                <div style={{ background: "rgba(103, 103, 103, 0.8)" }}>
                                    <p>{t('AdPolicy.FirstWeeklyAd.Description')}</p>
                                    <p>{t('AdPolicy.SubsequentAds.Description')}</p>
                                    <p>{t('AdPolicy.ResetWeekly.Description')}</p>
                                    <p>{t('AdPolicy.hightlightText.Description')}</p>
                                </div>
                            </span>
                        }
                    >
                        <span className='d-flex' onClick={() => handleTooltipOpen(item?.id)}>
                            {item?.infoIcon}
                        </span>
                    </Tooltip>
                </span>
                {isLoading ? (
                    <Skeleton animation="wave" width="30%" />
                ) : (
                    <div className='d-flex align-items-center justify-content-end '>
                        {slotData[0]?.isadfree === 1 && (item?.type === "ad_charge" || item?.type === "weekly_ad") && (
                            <div className="ribbon">
                                <span>{t('General.Free')}</span>
                            </div>
                        )}
                        <span className={`font-sans-serif ${item?.highLight ? 'highlighted-text' : "font-13"}`}>
                            {item.showCurrency ? <StarsIcon style={{ fontSize: 15, marginRight: 2, marginTop: 4 }} /> : ""}
                        </span>
                        {(highLightAmount > 0 || slotData[0]?.isadfree === 0) && (
                            <span className={`font-sans-serif ${item?.highLight ? 'highlighted-text' : "font-13"}`}>
                                {item.highLight ? `${item?.price}${showPlusIcon}` : item?.price}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default PrizeDistribution; 