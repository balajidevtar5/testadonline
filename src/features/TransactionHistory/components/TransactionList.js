import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { List, Skeleton } from "antd";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { TimestampConverter } from "./TimestampConverter";

export const TransactionList = ({ data, loading, totalCount, handleNext }) => {
  const { t } = useTranslation();

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent className="pl-0 pr-0">
        <Typography
          variant="h6"
          className="px-12"
          pt={0}
          mb={"20px"}
          borderBottom={"1px solid #eee"}
        >
          {t("General.transaction history")}
        </Typography>
        <div className="">
          <div className="d-flex justify-content-around transitioncontainer">
            <div
              id="scrollableDiv"
              className="transitioncontainer"
              style={{
                padding: '0 16px',
              }}
            >
              <InfiniteScroll
                dataLength={data.length}
                next={handleNext}
                hasMore={data.length < totalCount}
                loader={loading ? <Skeleton avatar paragraph={{ rows: 1 }} active /> : ""}
                scrollableTarget="scrollableDiv"
              >
                <List
                  dataSource={data}
                  renderItem={(item) => {
                    const isCredit = item?.iscredited === true;
                    const isFailed = item?.status === 'Failed' || item?.status === 'નિષ્ફળ' || item?.status === 'असफल' ;
                    const isIncomplete = item?.status === 'Incomplete'  || item?.status === 'અધૂરું' || item?.status === 'अधूरा' ;
                    const amountColor = isFailed || isIncomplete ? '#757575'  : (isCredit ? '#4caf50' : '#f44336');
                    const amountPrefix = isCredit ? '+' : '-';
                    
                    // Define status color based on status
                    let statusColor = '#757575'; // default gray
                    switch (item.status?.toLowerCase()) {
                      case 'pending':
                        statusColor = '#ff9800';
                        break;
                      case 'failed':
                      case  'નિષ્ફળ':
                      case 'असफल':
                        statusColor = '#f44336';
                        break;
                      default:
                        statusColor = '#757575';
                    }

                    return (
                      <List.Item key={item.id}>
                        <List.Item.Meta
                          title={
                            <span
                              style={{
                                textDecoration: (isFailed || isIncomplete) ? 'line-through' : 'none',
                              }}
                            >
                              {item.posttitle}
                            </span>
                          }
                          description={
                            <TimestampConverter timestamp={item.datestamp} />
                          } 
                        />
                        <div className="d-flex flex-column align-items-end">
                          <div className="d-flex align-items-center mb-1">
                            <Box
                              sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                position: "relative",
                                ...(isFailed || isIncomplete
                                  ? {
                                      "&::after": {
                                        content: '""',
                                        position: "absolute",
                                        left: 0,
                                        right: 0,
                                        top: "50%",
                                        borderTop: "2px solid",
                                        borderColor: amountColor,
                                        transform: "translateY(-50%)",
                                      },
                                    }
                                  : {}),
                              }}
                            >
                              <Typography
                                variant="body1"
                                sx={{
                                  fontWeight: "bold",
                                  color: amountColor,
                                  marginLeft: 0.5,
                                }}
                              >
                                {amountPrefix}
                                {item.amount}&nbsp;{t("General.Ptr")}
                              </Typography>
                            </Box>
                          </div>
                          {(isIncomplete || isFailed) && (
                            <span
                              style={{
                                fontSize: "0.75rem",
                                color: statusColor,
                                fontWeight: 500,
                              }}
                            >
                              {item.status}
                            </span>
                          )}
                        </div>
                      </List.Item>
                    );
                  }}
                />
              </InfiniteScroll>
            </div>
          </div>
        </div>
      </CardContent>
      
    </Card>
  );
};