import { useState } from "react";
import { useSelector } from "react-redux";

export const useReferralManager = () => {
  const [copiedId, setCopiedId] = useState(null);
  const { data: loginUserData } = useSelector((state) => state.loginUser);

  const referralCode =
    Array.isArray(loginUserData?.data) && loginUserData.data.length > 0
      ? loginUserData.data[0].referralcode
      : loginUserData?.data?.referralcode || "";

  const [referralLink, setReferralLink] = useState(referralCode);
  const [qrOpen, setQrOpen] = useState(false);

  const handleCopy = (value) => {
    navigator.clipboard.writeText(value);
    setCopiedId(value);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleQr = () => {
    setQrOpen(prev => !prev);
  };

  return {
    copiedId,
    referralLink,
    qrOpen,
    setReferralLink,
    setQrOpen,
    handleCopy,
    toggleQr,
    setCopiedId
  };
};