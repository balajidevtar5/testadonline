
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BottomNavigationComponent from '../bottomNavigation/bottomNavigation';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
const ContactUs = () => {
  const { t } = useTranslation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="primary-bold mt-61 py-12 pb-xs-85 max-h-100">
      <div className='contact-us-bg'>
        <div className='d-flex align-items-center'>
          <h4>{t("ContactUs.BusinessName")}: &nbsp;</h4>
          <p className='mb-2'>{t("ContactUs.BusinessNameValue")}</p>
        </div>
        <p className='mt-0 mb-15 d-flex align-items-center'>
          <LocationOnIcon className="font-22 contact-icon mr-15" /> {t("ContactUs.Address")}
        </p>
        <p className='mt-2 mb-2 d-flex align-items-center'>
          <LocalPhoneIcon className="font-22 contact-icon mr-15" /> 
          <a href='tel:+91 8160845612' className='text-reset'>{t("ContactUs.Phone")}</a>
        </p>
      </div>
      <BottomNavigationComponent />
    </div>




    </>
  )
}
export default ContactUs