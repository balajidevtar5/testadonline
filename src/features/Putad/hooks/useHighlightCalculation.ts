import { useEffect, useMemo } from "react";
import { message } from "antd";
import { useTranslation } from "react-i18next";

type SlotDataItem = {
  isadfree: number;
  postprice: number;
  totalcount: number;
  colorprice: number;
};

type ColorMap = {
  white: string;
  darkgray: string;
};

type UseHighlightCalculationProps = {
  selectedColor: string;
  slotData: SlotDataItem[];
  isDarkMode: boolean;
  highLightAmount: number;
  setHighLightAmount: React.Dispatch<React.SetStateAction<number>>;
  setHighLightColor: React.Dispatch<React.SetStateAction<string>>;
  setShowPlusIcon: React.Dispatch<React.SetStateAction<string>>;
  setHighLight: React.Dispatch<React.SetStateAction<boolean>>;
  amountCalculation: number;
  setAmountCalculation: React.Dispatch<React.SetStateAction<number>>;
  totalTargetAmount: number;
  activeStep: number;
  setTargetAmount: React.Dispatch<React.SetStateAction<number>>;
  colorMap: ColorMap;
};

const useHighlightCalculation = ({
  selectedColor,
  slotData,
  isDarkMode,
  highLightAmount,
  setHighLightAmount,
  setHighLightColor,
  setShowPlusIcon,
  setHighLight,
  amountCalculation,
  setAmountCalculation,
  totalTargetAmount,
  activeStep,
  setTargetAmount,
  colorMap,
}: UseHighlightCalculationProps) => {
  const { t } = useTranslation();

  const calculateAmount = useMemo(() => {
    if (slotData.length > 0) {
      const isNonDefaultColor = isDarkMode
        ? selectedColor !== "#242424"
        : selectedColor !== colorMap.white;

    if (slotData[0]?.isadfree !== 1 && isNonDefaultColor) {
      return (
        slotData[0]?.postprice * slotData[0]?.totalcount +
        slotData[0]?.colorprice
      );
    } else if (isNonDefaultColor && slotData[0]?.isadfree === 1) {
      return slotData[0]?.colorprice;
    } else if (!isNonDefaultColor && slotData[0]?.isadfree === 1) {
      return 0;
    } else {
      return slotData[0]?.postprice * slotData[0]?.totalcount;
    }
    }
    return 0;
  }, [selectedColor, slotData, isDarkMode, colorMap.white]);

  const targetAmount = useMemo(() => {
    if (!selectedColor) return 0;
    return (isDarkMode
      ? selectedColor === colorMap.darkgray
      : selectedColor === colorMap.white)
      ? 0
      : slotData[0]?.colorprice ?? 0;
  }, [selectedColor, slotData, isDarkMode, colorMap]);

  useEffect(() => {
    if (highLightAmount !== targetAmount) {
      const timer = setTimeout(() => {
        setHighLightAmount((prev) => {
          const isDefaultColor = isDarkMode
            ? selectedColor === colorMap.darkgray
            : selectedColor === colorMap.white;

          if (isDefaultColor) {
            if (prev > 0) {
              setHighLight(true);
              return prev - 1;
            }
          } else {
            if (prev < targetAmount) {
              setHighLight(true);
              message.info({
                key: "highlightCharge",
                content: `${t("toastMessage.Highlight charges will be")}  ${slotData[0]?.colorprice} ${t("General.Ptr")}`,
              });
              return prev + 1;
            } else {
              setHighLight(false);
              setHighLightColor("#4B5563");
              return targetAmount;
            }
          }
          return prev;
        });
      }, 4);

      return () => clearTimeout(timer);
    } else {
      setHighLightColor("#4B5563");
      setShowPlusIcon("");
      setHighLight(false);
    }
  }, [
    highLightAmount,
    targetAmount,
    selectedColor,
    isDarkMode,
    slotData,
    setHighLightAmount,
    setHighLightColor,
    setHighLight,
    setShowPlusIcon,
    t,
    colorMap,
  ]);

  useEffect(() => {
    if (activeStep === 4 && amountCalculation !== totalTargetAmount) {
      const difference = Math.abs(totalTargetAmount - amountCalculation);
      let increment = 1;

      if (difference > 500) increment = 50;
      else if (difference > 200) increment = 20;
      else if (difference > 50) increment = 15;
      else if (difference > 10) increment = 2;

      const timer = setTimeout(() => {
        setAmountCalculation((prev) => {
          const isDecreasing = isDarkMode
            ? selectedColor !== colorMap.darkgray
            : selectedColor !== colorMap.white;

          if (isDecreasing) {
            if (prev > totalTargetAmount) {
              setHighLight(true);
              return Math.max(prev - increment, totalTargetAmount);
            }
          } else {
            if (prev < totalTargetAmount) {
              setHighLight(true);
              return Math.min(prev + increment, totalTargetAmount);
            }
          }

          setHighLightColor("#4B5563");
          setShowPlusIcon("");
          setHighLight(false);
          return totalTargetAmount;
        });
      }, 10);

      return () => clearTimeout(timer);
    } else {
      setHighLightColor("#4B5563");
      setShowPlusIcon("");
      setHighLight(false);
    }
  }, [
    amountCalculation,
    totalTargetAmount,
    selectedColor,
    isDarkMode,
    activeStep,
    setAmountCalculation,
    setHighLight,
    setHighLightColor,
    setShowPlusIcon,
    colorMap,
  ]);

  useEffect(() => {
    setTargetAmount(calculateAmount);
  }, [calculateAmount, setTargetAmount]);

  return { calculateAmount, targetAmount };
};

export default useHighlightCalculation;
