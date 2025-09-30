export const formatIndianPrice = (value) => {
  const number = parseFloat(value);
  if (isNaN(number)) return "";
  return new Intl.NumberFormat("en-IN", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(number);
};

export const formatCount = (count) => {
  const numericCount = Number(count || 0);
  return numericCount > 0 ? numericCount.toString() : null;
};

export const formatMobileNumber = (mobileNumber) => {
  return mobileNumber;
}; 