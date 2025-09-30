import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export const PointsSummary = ({rewardDetail}) => {
  const { t } = useTranslation();

   
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent className="pl-0 pr-0">
        <Typography
          variant="h6"
          component="div"
          className="px-12"
          pt={0}
          mb={"20px"}
          borderBottom={"1px solid #eee"}
        >
          {t("General.Points Summary")}
        </Typography>
        <div className="mt-15 px-12">
          <div className="d-flex align-items-center justify-content-between gap py-12 px-12 mb-10 bg-light-purple-200 border-radius-10">
            <p className="mt-0 mb-5 font-16">{t("General.Recharge")}</p>
            <p className="mt-0 mb-5 font-17 font-bold">{(rewardDetail && rewardDetail[0]?.recharge) || 0}</p>
          </div>
          <div className="d-flex align-items-center justify-content-between gap py-12 px-12 mb-10 bg-light-yellow-200 border-radius-10">
            <p className="mt-0 mb-5 font-16">{t("General.Total Earnings")}</p>
            <p className="mt-0 mb-5 font-17 font-bold">{(rewardDetail && rewardDetail[0]?.earning) || 0}</p>
          </div>
          <div className="d-flex align-items-center justify-content-between gap py-12 px-12 mb-10 bg-light-red-200 border-radius-10">
            <p className="mt-0 mb-5 font-16">{t("General.PointsSummary.Points Spent")}</p>
            <p className="mt-0 mb-5 font-17 font-bold">{(rewardDetail && rewardDetail[0]?.spent) || 0}</p>
          </div>
          <div className="d-flex align-items-center justify-content-between gap py-12 px-12 bg-light-blue-200 border-radius-10">
            <p className="mt-0 mb-5 font-16">{t("General.PointsSummary.Net Available")}</p>
            <p className="mt-0 mb-5 font-17 font-bold">{(rewardDetail && rewardDetail[0]?.availablebalance) || 0}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};