import { Close } from "@mui/icons-material"
import BottomNavigationComponent from "../bottomNavigation/bottomNavigation"
import { useEffect } from "react";
import { useTranslation } from "react-i18next";


const TermAndCondition = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const { t } = useTranslation();
    return (
        <>
           <div className="primary-bold mt-61 py-12 pb-xs-85">
  {/* <div className='d-flex align-items-center justify-content-between px-24 bg-lightPrimary'>
      <h3 className='mt-10 mb-10'><b>Terms and Conditions</b></h3>
  </div> */}
  <div className='px-24'>
    <h4 className='mb-0 mt-10'>{t("Terms.Welcome")}</h4>
    <h4 className='mb-0'><b>{t("Terms.AcceptanceOfTermsTitle")}</b></h4>
    <p className='mt-10'>
      {t("Terms.AcceptanceOfTermsDescription")}
    </p>
    <h4 className='mb-0'><b>{t("Terms.UserConductTitle")}</b></h4>
    <p className='mt-10'>
      <ul className='pl-20 list-style-square'>
        <li className='mb-10'>{t("Terms.UserConductProhibitedActivities")}</li>
        <li className='mb-10'>{t("Terms.UserConductLaws")}</li>
        <li className='mb-10'>{t("Terms.UserConductFalseContent")}</li>
        <li className='mb-10'>{t("Terms.UserConductImpersonation")}</li>
        <li className='mb-10'>{t("Terms.UserConductInterference")}</li>
        <li className='mb-10'>{t("Terms.UserConductAccountTermination")}</li>
      </ul>
    </p>
    <h4 className='mb-0'><b>{t("Terms.IntellectualPropertyTitle")}</b></h4>
    <p className='mt-10'>
      {t("Terms.IntellectualPropertyDescription")}
    </p>
    <h4 className='mb-0'><b>{t("Terms.LimitationOfLiabilityTitle")}</b></h4>
    <p className='mt-10'>
      {t("Terms.LimitationOfLiabilityDescription")}
    </p>
    <h4 className='mb-0'><b>{t("Terms.DisputeResolutionTitle")}</b></h4>
    <p className='mt-10'>
      {t("Terms.DisputeResolutionDescription")}
    </p>
    <h4 className='mb-0'><b>{t("Terms.ChangesToTermsTitle")}</b></h4>
    <p className='mt-10'>
      {t("Terms.ChangesToTermsDescription")}
    </p>
    <h4 className='mb-0'><b>{t("Terms.ContactUsTitle")}</b></h4>
    <p className='mt-10'>
      {t("Terms.ContactUsDescription")} <span className="text-primary">+91 8160845612</span>.
    </p>
  </div>
  <BottomNavigationComponent />
</div>

        </>
    )
}
export default TermAndCondition