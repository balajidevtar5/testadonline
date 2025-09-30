import React, { useContext, useEffect, useState, useRef } from "react";
import { Divider, List, message, Skeleton } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/reducer";
import { getWalletHistory } from "../../redux/services/payment.api";
import { useTranslation } from "react-i18next";
import { LayoutContext } from "../layout/LayoutContext";
import BottomNavigationComponent from "../bottomNavigation/bottomNavigation";
import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import QRCode from "react-qr-code";
import { toBlob } from "html-to-image";
import { useReferralShare } from "../../features/Home/hooks/useSharePost";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
} from "@mui/material";
import {
  Share,
  PersonAdd,
  CalendarToday,
  Star,
  QrCode,
  ContentCopy,
  CreditCard,
  CardGiftcard,
  CheckCircle,
  Verified,
} from "@mui/icons-material";
import { logEffect } from "../../utils/logger";
import TransactionHistory from "../../features/TransactionHistory";

interface DataType {
  posttitle?: String;
  datestamp?: String;
  amount?: number;
  status?: String;
  id?: any;
}

const Transitionhistory: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataType[]>([]);
  const { data: loginUserData } = useSelector(
    (state: RootState) => state.loginUser
  );
  const {
    isTransition,
    setIsTransition,
    setAdOptionModalOpen,
    AdOptionModalOpen,
    isDarkMode
  } = useContext(LayoutContext);
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [copiedId, setCopiedId] = useState(null);
  const [referralLink, setReferralLink] = useState("https://adonline.in/home");
  const [qrOpen, setQrOpen] = useState(false);
  const qrRef = useRef(null);

  const { shareReferral, shareReferralWithQr, getShareMessage } = useReferralShare();
  const handleClick = (e, action: string, value: string) => {
    e.stopPropagation();
    if (action === "copy") {
      navigator.clipboard.writeText(value);
    }
  }

  const loadMoreData = async () => {
    setLoading(true);
    const payload = {
      PageNumber: currentPage,
      PageSize: 30,
    };
    const response = await getWalletHistory(payload);
    if (response?.success) {
      if (isTransition) {
        setData([]);
        // setCurrentPage(1)
      } else {
        setData([...data, ...response.data]);
      }
      setIsTransition(false);
      setTotalCount(response.data[0]?.totalcount);
      setLoading(false);
    }
  };

  const handleNext = () => {
    setCurrentPage(currentPage + 1);
    setIsTransition(false);
  };

  const TimestampConverter = ({ timestamp }) => {
    const date = new Date(timestamp);
    const formattedDate = `${date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })} ${date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}`;

    return <div>{formattedDate}</div>;
  };
  useEffect(() => {
    loadMoreData();
  }, [isTransition, currentPage]);
  return (
    <>
      <TransactionHistory  />
    </>
  );
};

export default Transitionhistory;