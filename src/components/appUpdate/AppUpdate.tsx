import { useNavigate } from 'react-router-dom';
import notFoundImg from "../../assets/images/pageNotFound.png";
import { Button } from "@mui/material";
import rocketIcon from './../../assets/images/rocket-icon.png';
import { Android_app_url,IOS_app_url } from '../../libs/constant';

const AppUpdate = () => {
  const navigate = useNavigate();

  const handleAppUpdate = () => {
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.indexOf('android') > -1) {
      // Redirect to Android app store
      window.location.href = Android_app_url;
    } else if (userAgent.indexOf('iphone') > -1 || userAgent.indexOf('ipad') > -1) {
      // Redirect to iOS app store
      window.location.href = IOS_app_url;
    } else {
      
    }
  };

  return (
    <div className='overflow-y-hidden mt-60 update-app'>
      <img src={rocketIcon} alt='rocketIcon' width={100} />
      <h3 className='mb-5'>App Update Required!</h3>
      <p className='mt-10 mb-20'>You're using a version of the app that is no longer supported. Please update to the newest app version to continue.</p>
      <Button onClick={handleAppUpdate} variant="contained" className="text-center">
        Update App
      </Button>
    </div>
  );
};

export default AppUpdate;
