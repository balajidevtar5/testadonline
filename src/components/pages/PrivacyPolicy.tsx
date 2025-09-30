import { Close } from "@mui/icons-material"
import BottomNavigationComponent from "../bottomNavigation/bottomNavigation"
import { useEffect } from "react";
import { useTranslation } from "react-i18next";


const PrivacyPolicy = () => {
    const { t } = useTranslation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <>
          <div className="primary-bold mt-61 py-12 pb-xs-85">
  {/* <div className='d-flex align-items-center justify-content-between px-24 bg-lightPrimary '>
      <h3 className='mt-10 mb-10'><b>Privacy Policy</b></h3>
  </div> */}
  <div className='px-24'>
    <h4 className='mb-0 mt-10'>{t("PrivacyPolicy.Welcome")}</h4>
    <h4 className='mb-0'><b>{t("PrivacyPolicy.InformationWeCollectTitle")}</b></h4>
    <p className='mt-10'>
      {t("PrivacyPolicy.InformationWeCollectDescription")}
    </p>
    <h4 className='mb-0'><b>{t("PrivacyPolicy.HowWeUseYourInformationTitle")}</b></h4>
    <p className='mt-10'>
      <ul className='pl-20 list-style-square'>
        <li className='mb-10'>{t("PrivacyPolicy.HowWeUseYourInformation1")}</li>
        <li className='mb-10'>{t("PrivacyPolicy.HowWeUseYourInformation2")}</li>
        <li className='mb-10'>{t("PrivacyPolicy.HowWeUseYourInformation3")}</li>
        <li className='mb-10'>{t("PrivacyPolicy.HowWeUseYourInformation4")}</li>
      </ul>
    </p>
    <h4 className='mb-0'><b>{t("PrivacyPolicy.DataSharingAndDisclosureTitle")}</b></h4>
    <p className='mt-10'>
      <ul className='pl-20 list-style-square'>
        <li className='mb-10'>{t("PrivacyPolicy.DataSharingAndDisclosure1")}</li>
        <li className='mb-10'>{t("PrivacyPolicy.DataSharingAndDisclosure2")}</li>
        <li className='mb-10'>{t("PrivacyPolicy.DataSharingAndDisclosure3")}</li>
      </ul>
    </p>
    <h4 className='mb-0'><b>{t("PrivacyPolicy.CookiesAndTrackingTechnologiesTitle")}</b></h4>
    <p className='mt-10'>
      {t("PrivacyPolicy.CookiesAndTrackingTechnologiesDescription")}
    </p>
    <h4 className='mb-0'><b>{t("PrivacyPolicy.YourRightsTitle")}</b></h4>
    <p className='mt-10'>
      <ul className='pl-20 list-style-square'>
        <li className='mb-10'>{t("PrivacyPolicy.YourRights1")}</li>
        <li className='mb-10'>{t("PrivacyPolicy.YourRights2")}</li>
        <li className='mb-10'>{t("PrivacyPolicy.YourRights3")}</li>
      </ul>
    </p>
    <h4 className='mb-0'><b>{t("PrivacyPolicy.SecurityMeasuresTitle")}</b></h4>
    <p className='mt-10'>{t("PrivacyPolicy.SecurityMeasuresDescription")}</p>
    <h4 className='mb-0'><b>{t("PrivacyPolicy.ChangesToThisPrivacyPolicyTitle")}</b></h4>
    <p className='mt-10'>{t("PrivacyPolicy.ChangesToThisPrivacyPolicyDescription")}</p>
    <h4 className='mb-0'><b>{t("PrivacyPolicy.ContactUsTitle")}</b></h4>
    <p className='mt-10'>{t("PrivacyPolicy.ContactUsDescription")} <span className="text-primary">+91 8160845612</span>.</p>
    <p>{t("PrivacyPolicy.RememberToReplace")}</p>
  </div>
  <BottomNavigationComponent />
</div>

        </>
    )
}
export default PrivacyPolicy