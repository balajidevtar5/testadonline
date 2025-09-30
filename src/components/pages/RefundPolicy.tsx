import { Close } from "@mui/icons-material"
import BottomNavigationComponent from "../bottomNavigation/bottomNavigation";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const RefundPolicy = () => {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="primary-bold mt-61 py-12 pb-xs-85">
      {/* <div className="d-flex align-items-center justify-content-between px-24 bg-lightPrimary">
        <h3 className="mt-10 mb-10"><b>Refund Policy</b></h3>
      </div> */}
     <div className="px-24">
  <h4 className="mt-10">{t("RefundPolicy.Welcome")}</h4>
  <RefundingRules />
  <AmountDeducted />
  <ChangesToPolicy />
  <ContactUs />
</div>
      <BottomNavigationComponent />

    </div>
  );
};
const RefundingRules = () => {
  const { t } = useTranslation();

  return (
    <>
      <h4 className="mb-0"><b>{t("RefundPolicy.RefundingRules.Title")}</b></h4>
      <p className="mt-10">
        <strong>AdOnline.in</strong> {t("RefundPolicy.RefundingRules.Description")}
      </p>
    </>
  );
};

const AmountDeducted = () => {
  const { t } = useTranslation();

  return (
    <>
      <h4 className="mb-0"><b>{t("RefundPolicy.AmountDeducted.Title")}</b></h4>
      <p className="mt-10">
        <ul className="pl-20 list-style-square">
          <li className="mb-10">{t("RefundPolicy.AmountDeducted.Item1")}</li>
          <li className="mb-10">{t("RefundPolicy.AmountDeducted.Item2")}</li>
          <li className="mb-10">{t("RefundPolicy.AmountDeducted.Item3")}</li>
        </ul>
      </p>
    </>
  );
};

const ChangesToPolicy = () => {
  const { t } = useTranslation();

  return (
    <>
      <h4 className="mb-0"><b>{t("RefundPolicy.ChangesToPolicy.Title")}</b></h4>
      <p className="mt-10">{t("RefundPolicy.ChangesToPolicy.Description")}</p>
    </>
  );
};

const ContactUs = () => {
  const { t } = useTranslation();

  return (
    <>
      <h4 className="mb-0"><b>{t("RefundPolicy.ContactUs.Title")}</b></h4>
      <p className="mt-10">{t("RefundPolicy.ContactUs.Description")}</p>
    </>
  );
};

export default RefundPolicy