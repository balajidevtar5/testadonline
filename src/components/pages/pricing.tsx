import { Close } from "@mui/icons-material"
import BottomNavigationComponent from "../bottomNavigation/bottomNavigation"
import { useEffect } from "react";
import { useTranslation } from "react-i18next";


const Pricing = () => {

  const { t } = useTranslation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <div className="primary-bold mt-61 py-12 pb-xs-85">
        {/* <div className='d-flex align-items-center justify-content-between px-24 bg-lightPrimary'>
                    <h3 className='mt-10 mb-10'><b>Pricing</b></h3>
                </div> */}
        <div className='px-24'>
          <h4 className='mb-0 mt-10'>{t("Pricing.WelcomeTitle")}</h4>
          <p>
            {t("Pricing.WelcomeDescription")}
          </p>
          <h4 className='mb-0'><b>{t("Pricing.FreeAdsTitle")}</b></h4>
          <p className='mt-10'>
            {t("Pricing.FreeAdsDescription")}
          </p>
          <h4 className='mb-0'><b>{t("Pricing.PaidAdsTitle")}</b></h4>
          <p className='mt-10'>
            {t("Pricing.PaidAdsDescription")}
          </p>
          {/* <h4 className='mb-0'><b>{t("Pricing.HighlightAdsTitle")}</b></h4>
  <p className='mt-10'>
    {t("Pricing.HighlightAdsDescription")}
  </p> */}
          <h4 className='mb-0'><b>{t("Pricing.ContactUsTitle")}</b></h4>
          <p className='mt-10'>
            {t("Pricing.ContactUsDescription")} <span className="text-primary">+91 8160845612</span>.
          </p>
        </div>
        <BottomNavigationComponent />
      </div>
    </>
  )
}
export default Pricing