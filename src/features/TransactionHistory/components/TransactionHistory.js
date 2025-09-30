import React from "react";
import { Box, Grid } from "@mui/material";
import { useTransactionHistory, useReferralManager } from "../hooks";
import { EarningsHeader } from "./EarningsHeader";
import { ActivityLog } from "./ActivityLog";
import { TransactionList } from "./TransactionList";
import { ReferralCard } from "./ReferralCard";
import { PointsSummary } from "./PointsSummary";
import BottomNavigationComponent from "../../../components/bottomNavigation/bottomNavigation";
import useGetRewardDetailAction from "../hooks/useRewardApiCall";
import { useContext, useEffect } from "react";
import { LayoutContext } from "../../../components/layout/LayoutContext";

const TransactionHistory = () => {
  const { transactionHistoryRefreshKey } = useContext(LayoutContext);
  const { loading, data, totalCount, handleNext, loadMoreData, refetch } =
    useTransactionHistory();
  const { rewardDetail, error,setLoading } = useGetRewardDetailAction();
  const {
    copiedId,
    referralLink,
    qrOpen,
    setReferralLink,
    setQrOpen,
    setCopiedId,
  } = useReferralManager();

  return (
    <>
      <div className="transitionoutercontainer">
        <div className="transition-data">
          <div className="transitioncontainer">

            {/* Optional balance div - commented out in original */}
            {/*<div className="mt-61 balancediv" style={{ padding: '10px 0px'}}>
            {t("Menus.Balance")} : {loginUserData?.data && loginUserData?.data[0]?.balance}
          </div>*/}
          </div>

          <Box p={2} sx={{ bgcolor: "#f4f6fa" }}>
            {/* Total Earnings Header */}
            <div className="d-xl-none d-block">
              <EarningsHeader rewardDetail={rewardDetail} />
              <ReferralCard
                referralLink={referralLink}
                setReferralLink={setReferralLink}
                qrOpen={qrOpen}
                setQrOpen={setQrOpen}
                copiedId={copiedId}
                setCopiedId={setCopiedId}
              />
            </div>
            <Box p={0} sx={{ bgcolor: "#f4f6fa" }}>
              <Grid container spacing={3} className="w-100 ml-0">
                {/* Activity Log and Transaction History */}
                <Grid item xs={12} className="pl-0 pr-12">
                  <Grid container spacing={2}>
                    {/* Left: Transaction List */}
                    <Grid item xs={12} md={7}>
                      <TransactionList
                        data={data}
                        loading={loading}
                        totalCount={totalCount}
                        handleNext={handleNext}
                      />
                    </Grid>

                    <Grid item xs={12} md={5}>
                      <div className="d-xs-none">
                        <EarningsHeader rewardDetail={rewardDetail} />
                        <ReferralCard
                          referralLink={referralLink}
                          setReferralLink={setReferralLink}
                          qrOpen={qrOpen}
                          setQrOpen={setQrOpen}
                          copiedId={copiedId}
                          setCopiedId={setCopiedId}
                        />
                      </div>
                      {/* Sidebar with Referral and Points Summary */}
                      <PointsSummary rewardDetail={rewardDetail} />
                    </Grid>
                  </Grid>
                </Grid>


              </Grid>
            </Box>
          </Box>

          <BottomNavigationComponent />
        </div>
      </div>
    </>
  );
};

export default TransactionHistory;
