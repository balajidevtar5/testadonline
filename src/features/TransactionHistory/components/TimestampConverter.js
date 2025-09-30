import React from "react";

export const TimestampConverter = ({ timestamp }) => {
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