import { yupResolver } from '@hookform/resolvers/yup';
import { Button, CardContent, Chip, CircularProgress, Grid, Typography } from '@mui/material';
import { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { MAIN_COLOR } from '../../config/theme';
import { LOGEVENTCALL, logEvents, RAZORPAY_SCRIPT, REACT_APP_RAZORPAY_KEY } from '../../libs/constant';
import { deepClone } from '../../libs/helper';
import { RootState } from '../../redux/reducer';
import { AddUpdatePaymentAPI, CompleteOrderProcessAPI } from '../../redux/services/payment.api';
import { LoginUserState, loginUserUpdate } from '../../redux/slices/auth';
import { AdFundSchema } from '../../schema/AdFundSchema';
import InputField from '../formField/FormFieldComponent';
import { Divider, message } from 'antd';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { LayoutContext } from '../../components/layout/LayoutContext';
import { UnfoldingAnimation } from "../../utils/UnfoldingAnimation";
import { AnimatePresence, motion } from "framer-motion";
import SmoothPopup from "../../dialog/animations/FancyAnimatedDialog";
import { logEffect } from '../../utils/logger';
import { logEvent } from 'firebase/analytics';
import StarsIcon from '@mui/icons-material/Stars';
import useGetRewardDetailAction from '../../features/TransactionHistory/hooks/useRewardApiCall';
import { useTransactionHistory } from '../../features/TransactionHistory/hooks/useTransactionHistory';
// import { logEvent } from 'firebase/analytics';
declare global {
  interface Window {
    Razorpay: any;
  }
}
interface AddFundInterface {
  handleOk?: (data: any) => void;
  amountCalculation?: any,
}
const AddFundComponent = (props: AddFundInterface) => {
  const { isDarkMode,setTransactionHistoryRefreshKey } = useContext(LayoutContext);
  const [selectedColor, setSelectedColor] = useState(isDarkMode ? "#242424" : "#fff");
    const { data: settingData } = useSelector((state: RootState) => state.settingList);
  const { handleOk, amountCalculation } = props;
  const { register, control, formState, setValue, watch, handleSubmit, setError } = useForm({ resolver: yupResolver(AdFundSchema) })
  const [amount, setAmount] = useState(100);
  const [points, setPoinnts] = useState(100);
  const [animateKey, setAnimateKey] = useState(0);
  const [paymentResponse, setPaymentResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rate, setRate] = useState(0);
  const watchField = watch();
  const { data: loginUserData }: LoginUserState = useSelector((state: RootState) => state.loginUser);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const rupeesOption = [
    { id: 1, rupees: 100 },
    { id: 2, rupees: 200 },
    { id: 3, rupees: 500 },
    { id: 4, rupees: 1000 },
  ]
  const { rewardDetail, refetch: refetchReward } = useGetRewardDetailAction(false);
  const { loadMoreData: refreshTransactionHistory } = useTransactionHistory();
  

  function loadScript(src: string) {
    return new Promise((resolve, reject) => {
      const existingScript = document.getElementById(src);
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = src;
        script.id = src;
        script.onload = () => {
          resolve(true);
        };
        script.onerror = () => {
          reject(new Error(`Error loading ${src}`));
        };
        document.body.appendChild(script);
      } else {
        resolve(true);
      }
    });
  }
  const handlePayment = async () => {
    if (paymentResponse) {
      const res = await loadScript(RAZORPAY_SCRIPT);
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
      }
      const options = {
        key: REACT_APP_RAZORPAY_KEY,
        amount: paymentResponse?.amount,
        currency: paymentResponse?.currency,
        name: "Ad Online Corp.",
        order_id: paymentResponse?.orderid,
        prefill: {
          name: paymentResponse?.name,
          contact: paymentResponse?.mobileno,
        },
        notes: {
          address: paymentResponse?.address,
        },
        theme: {
          color: isDarkMode ? "$black-300" : "#ffffff", backdrop_color: isDarkMode ? "$black-300" : "#f5f5f5",
        },
        handler: async function (response: { razorpay_payment_id: any; razorpay_order_id: any; razorpay_signature: any; }) {
          const data = {
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };
          if (data) {
            try {
              const response = await CompleteOrderProcessAPI(data);
              if (response.success) {
                message.success(response.message);
                setTransactionHistoryRefreshKey(true)
                const loginUserUpdatePayload: any = deepClone(loginUserData);
                loginUserUpdatePayload.data[0].balance = paymentResponse?.amount + loginUserUpdatePayload.data[0].balance;
                dispatch(loginUserUpdate(loginUserUpdatePayload));
                await Promise.all([
                  refetchReward(),
                  // refreshTransactionHistory()
                ]);
                if (handleOk) {
                  handleOk(response)
                  if (LOGEVENTCALL) {
                    logEffect(logEvents.Fund_Added)
                  }
                };
              } else {
                message.error(response.message);
              }
            } catch (error) {
              await Promise.all([
                refetchReward(),
                refreshTransactionHistory()
              ]);
              
            }
          }
        },
        modal: {
          ondismiss: async function() {
            await Promise.all([
              refetchReward(),
              refreshTransactionHistory()
            ]);
          }
        }
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    }
  };

  const onSubmit = async (values: any) => {
    try {
      if (amountCalculation > amount) {
        setError("Amount", {
          message: `${t(
            "General.Amount must be greater than"
          )} ${amountCalculation}`,
        });
        return;
      }
      setIsLoading(true);
      const response = await AddUpdatePaymentAPI(values?.Amount)

      if (response?.success) {
        setIsLoading(false);
        
        // message.success(respo  nse.message);
        setPaymentResponse(response.data[0]);
      } else {
        setIsLoading(false);
        message.error(response.message);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    handlePayment();
  }, [paymentResponse]);

  useEffect(() => {
    if (amountCalculation > amount) {
      setValue("Amount", amountCalculation);
      setAmount(amountCalculation);
    } else if (amount > 0) setValue("Amount", amount);

    const rateItem = settingData?.data?.find(elm => elm?.name === "INRToPoint");
    const pointsRate = rateItem ? rateItem.value : 0;
    setRate(pointsRate);
  }, []);

  //useEffect(() => {
  //  if (
  //    Number(watchField?.Amount) > 50 &&
  //    Number(watchField?.Amount) < Number(amountCalculation)
  //  ) {
  //    setError("Amount", {
  //      message: `${t(
  //        "General.Amount must be greater than"
  //      )} ${amountCalculation}`,
  //    });
  //  } else {
  //    setError("Amount", {});
  //  }
  //}, [watchField?.Amount]);

  useEffect(() => {
    const amountValue = Number(watchField?.Amount);
    if (amountValue < 50) {
      setError("Amount", {
        message: `${t("General.Amount must be greater than")} ₹50`,
      });
    } else if (amountValue > 500000) {
      setError("Amount", {
        message: `${t("General.Amount must be less than")} ₹5,00,000`,
      });
    } else {
      setError("Amount", {});
    }

    setPoinnts(amountValue * 0.10)
  }, [watchField?.Amount]);

  useEffect(() => {
    setPoinnts(amount * rate);
    setAnimateKey((prev) => prev + 1);
  }, [amount,rate]);


  useEffect(() => {
    if (!paymentResponse) {
      setAmount(100); // Reset to default or desired initial value
      setValue("Amount", 100); // Reset form value
      setError("Amount", {}); // Clear any existing errors
    }
  }, [paymentResponse]);

  return (
    <SmoothPopup open={true}>
      <Grid container>
        <Grid lg={12} md={12} sm={12} xs={12}>
          <form id="AddMoneyIntoWalletForm" onSubmit={handleSubmit(onSubmit)} >
            {/* <Card> */}
            <div className='p-5'>
              <CardContent className='' style={{ backgroundColor: selectedColor }}>
                <Typography variant='h5' className='text-center mb-25'>{t("General.Add Points into")} <span className='text-primary'>{t("General.Wallet")}</span></Typography>
                <InputField {...{
                  register,
                  control,
                  formState,
                  id: "Amount",
                  name: "Amount",
                  type: "number",
                  value: amount,
                  watchField,
                  autoFocus: true,
                  placeholder: "Enter amount",
                  label: t("General.Amount*"),
                  className: "hideNumberSpin",
                  parentClassName: "mt-20 mb-20",
                  onInput: (e) => {
                    e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 8)
                    setAmount(e.target.value)
                  }
                }} />

                <div className="text-center mt-10 mb-10">
                  <Typography variant="caption" style={{ color: isDarkMode ? '#888' : '#666' }}>
                    1 ₹ = {rate} Points
                  </Typography>
                </div>

                <div className="bg-white mt-15 mb-15 p-6 rounded-2xl shadow-xl border border-blue-100 w-fit mx-auto mt-10">
                  <div className="text-center text-lg text-gray-600 font-medium">
                    <motion.span
                      key={`amount-${animateKey}`}
                      initial={{ scale: 0.8, opacity: 0.5 }}
                      animate={{ scale: 1.1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-blue-600 font-bold d-flex align-items-center justify-content-center"
                    >
                      {<StarsIcon fontSize="small" style={{ marginRight: 2 }}/>}{points.toFixed(2)} {t("General.Ptr")}
                    </motion.span>
                  </div>
                </div>
                <div className='d-flex gap flex-wrap cursor-pointer mb-25' >
                  {rupeesOption?.map((d) => (
                    <Chip
                      key={d?.id}
                      label={
                        <div style={{ color: isDarkMode ? "#fff" : "#000", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                          {/*+<span className='font-sans-serif'>₹</span>{d?.rupees}*/}
                          <span style={{ display: 'flex', alignItems: 'center' }} >
                          <span style={{ fontWeight: 600, marginRight: 2 }}>+</span>
                            <StarsIcon style={{ marginRight: 2 }} sx={{ fontSize: 15 }} />
                            {(d?.rupees * rate)}
                          </span>
                        </div>
                      }
                      variant="outlined"
                      onClick={() => { setAmount(d?.rupees); setValue("Amount", d?.rupees) }}
                    />
                  ))}
                </div>
                <Divider dashed={true} style={{ borderWidth: "2px 0 0" }} />
                <div className='d-flex justify-content-end gap-3'>
                  <div style={{ marginRight: "10px" }}>
                    <Button onClick={handleOk} variant='contained'
                      className='text-transform-none w-100 close-btn ' >
                      {t("General.Cancel")}
                    </Button>
                  </div>
                  <div>
                    <Button variant='contained' type='submit' form="AddMoneyIntoWalletForm"
                      disabled={formState.errors?.Amount?.message ? true : false}
                      className='text-transform-none w-100'>
                      {isLoading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        <>
                          {(i18n.language === 'gu' || i18n.language === 'hi') && watchField?.Amount > 0 && (
                             //<span className='font-sans-serif'>₹{watchField?.Amount}&nbsp;</span>
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                              <StarsIcon fontSize="small" style={{ marginRight: 2 }} sx={{ color: 'white', fontSize: 18 }} />
                              {(watchField?.Amount * rate)}
                            </span>
                          )}&nbsp;
                          {t("General.Proceed to add")} &nbsp;
                          {!(i18n.language === 'gu' || i18n.language === 'hi') && watchField?.Amount > 0 && (
                            //<span className='font-sans-serif'>&nbsp;₹{watchField?.Amount}</span>
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                            <StarsIcon style={{ marginRight: 2 }} sx={{ color: 'white', fontSize: 18 }} />
                            {(watchField?.Amount * rate)}
                          </span>
                          )}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </div>
            {/* </Card> */}
          </form>
        </Grid>
      </Grid >
    </SmoothPopup>
  )
}

export default AddFundComponent