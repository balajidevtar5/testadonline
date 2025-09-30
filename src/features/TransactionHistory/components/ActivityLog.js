import React from "react";
import { Typography, Card, CardContent } from "@mui/material";
import { CheckCircle, Verified, Share } from "@mui/icons-material";

export const ActivityLog = () => {
  return (
    <Card sx={{ borderRadius: 3 }} className="mb-20">
      <CardContent className="pl-0 pr-0 pb-10">
        <Typography
          variant="h6"
          component="div"
          className="px-12"
          pt={0}
          mb={"20px"}
          borderBottom={"1px solid #eee"}
        >
          Activity Log
        </Typography>
        <div className="mt-15 px-12">
          <div className="d-flex justify-content-between gap py-12 px-12 mb-10 bg-light-green-200 border-radius-10">
            <div className="d-flex gap">
              <CheckCircle
                className="text-green"
                sx={{
                  bgcolor: "#c9e9c9",
                  padding: "5px",
                  borderRadius: "100px",
                }}
              />
              <div>
                <p className="mt-0 mb-5 font-15 font-semibold">
                  Daily using the app
                </p>
                <p className="mt-0 mb-5 text-grey">Today, 09:30 AM</p>
              </div>
            </div>
            <div className="text-align-end">
              <p className="font-17 font-bold text-green mt-0 mb-0">-500</p>
              <p className="text-green mt-0 mb-5">Success</p>
            </div>
          </div>
          
          <div className="d-flex justify-content-between gap py-12 px-12 mb-10 bg-light-blue-200 border-radius-10">
            <div className="d-flex gap">
              <Verified
                sx={{
                  color: "#2F6AEC",
                  bgcolor: "#ccd8f3",
                  padding: "5px",
                  borderRadius: "100px",
                }}
              />
              <div>
                <p className="mt-0 mb-5 font-15 font-semibold">
                  Refer a friend
                </p>
                <p className="mt-0 mb-5 text-grey">Yesterday, 03:15 PM</p>
              </div>
            </div>
            <div className="text-align-end">
              <p className="font-17 font-bold text-blue mt-0 mb-0">+100</p>
              <p className="text-blue mt-0 mb-5">Verified</p>
            </div>
          </div>
          
          <div className="d-flex justify-content-between gap py-12 px-12 mb-10 bg-light-red-200 border-radius-10">
            <div className="d-flex gap">
              <Share
                sx={{
                  color: "#ff7100",
                  bgcolor: "#ffd2af",
                  padding: "5px",
                  borderRadius: "100px",
                }}
              />
              <div>
                <p className="mt-0 mb-5 font-15 font-semibold">
                  Share post on social media
                </p>
                <p className="mt-0 mb-5 text-grey">2 days ago, 11:45 AM</p>
              </div>
            </div>
            <div className="text-align-end">
              <p className="font-17 font-bold text-primary mt-0 mb-0">+25</p>
              <p className="text-primary mt-0 mb-5">Completed</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};