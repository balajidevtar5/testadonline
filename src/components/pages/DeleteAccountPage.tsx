import React, { useContext } from 'react';
import { Button } from "@mui/material";
import deleteImage from './../../assets/images/delete-img.png';
import { LayoutContext } from '../layout/LayoutContext';
import { deleteAccountAPI } from '../../redux/services/user.api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { RootState } from '../../redux/reducer';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import BottomNavigationComponent from '../bottomNavigation/bottomNavigation';
import { getData } from '../../utils/localstorage';
import { useCookies } from 'react-cookie';
import { loginReset, loginUserReset } from '../../redux/slices/auth';

const DeleteAccountPage = () => {
    const { doLogout,filterValue,setFilterValue } = useContext(LayoutContext)
    const { data: loginUserData } = useSelector((state: RootState) => state.loginUser);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [{ encryptedAdminAuth },removeCookie]: any = useCookies(["encryptedAdminAuth"]);
     const dispatch = useDispatch();
    const deleteAccount = async() =>{
        try {
            if(loginUserData && loginUserData?.data ){
                const resp = await deleteAccountAPI();
                if (resp?.success) {
                    message.success(resp.message)
                    // doLogout()
                    removeCookie("adminAuth", { path: "/" });
                    dispatch(loginReset());
                    dispatch(loginUserReset());
                    navigate("/")
                }
            }else{
                message.error("Please Login First")
            }
          
        } catch (error) {
           
        }
   }
    return (
        <div className='deleteaccount '>
      <div className='mt-10 mb-15 pl-10 pr-10'>
        <img src={deleteImage} alt={t('DeleteAccount.ImageAlt')} />
        
        <h2 className='text-primary mb-10'>{t('DeleteAccount.Title')}</h2>
        
        <h4 className='mt-10 mb-0'>{t('DeleteAccount.ConfirmationQuestion')}</h4>
        <p className='mt-10'>{t('DeleteAccount.WarningMessage')}</p>
        
        <div className='d-flex justify-content-center gap mt-20'>
          <Button onClick={deleteAccount}  type="submit" variant="contained" className="text-center">
            {t('DeleteAccount.YesButton')}
          </Button>
          <Button 
            type="reset" 
            onClick={() => {
              navigate("/home");
              setFilterValue({ ...filterValue, IsPost: true, IsPremiumAd: true, LanguageId:getData("i18nextLng") || 2 });
            }} 
            variant="outlined" 
            color="error" 
            className='close-btn'
          >
            {t('DeleteAccount.NoButton')}
          </Button>
        </div>
      </div>
      {
        loginUserData?.data && <BottomNavigationComponent />
      }
    </div>
    )
    
}

export default DeleteAccountPage