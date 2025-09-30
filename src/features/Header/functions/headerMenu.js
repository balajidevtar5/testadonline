import React from 'react';
import { useTranslation } from 'react-i18next';
import { PricingPolicyIcon } from "../../../assets/icons/pricingPolicyIcon";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PrivacyTipOutlinedIcon from "@mui/icons-material/PrivacyTipOutlined";
import { RefundIcon } from "../../../assets/icons/refundIcon";

export const HeaderMenu = ({ 
  setAnchorEl, 
  setMenuOpenDrawer, 
  setFilterValue, 
  filterValue, 
  setIsPostClear, 
  setIsFeatchCategoryCount,
  handleMoreMenuNavigate,
  setPendingNavigation
}) => {
  const { t } = useTranslation();

  const menuItems = [
    {
      id: 1,
      name: t("Menus.Home"),
      mode: "home",
      link: "/",
      onClick: () => {
        setAnchorEl(null);
        setMenuOpenDrawer(false);
        setFilterValue({ ...filterValue, IsPost: true, IsPremiumAd: true });
        setIsPostClear(true);
        setIsFeatchCategoryCount(true);
        setPendingNavigation("/");
      },
    },
    {
      id: 2,
      name: "About",
      mode: "about",
      onClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        setAnchorEl(null);
        setPendingNavigation("/about");
        setMenuOpenDrawer(false);
      },
    },
    {
      id: 3,
      name: t("Menus.Policy"),
      mode: "policy",
      dropdown: [
        {
          key: 1,
          label: t("Menus.Pricing"),
          mode: "pricing",
          onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            setAnchorEl(null);
            setPendingNavigation("/policy/pricing");
            setMenuOpenDrawer(false);
          },
          icon: (
            <PricingPolicyIcon
              className="font-22 text-black mr-5"
              style={{ fill: "black", color: "black" }}
              width={20}
              height={20}
            />
          ),
        },
        {
          key: 2,
          label: t("Menus.Terms & condition"),
          mode: "terms-condition",
          onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            setAnchorEl(null);
            setPendingNavigation("/policy/terms-condition");
            setMenuOpenDrawer(false);
          },
          icon: <DescriptionOutlinedIcon className="font-20 text-black mr-5" />,
        },
        {
          key: 3,
          label: t("Menus.Privacy policy"),
          mode: "privacy",
          onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            setAnchorEl(null);
            setPendingNavigation("/policy/privacy");
            setMenuOpenDrawer(false);
          },
          icon: <PrivacyTipOutlinedIcon className="font-20 text-black mr-5" />,
        },
        {
          key: 4,
          label: t("Menus.Refund policy"),
          mode: "refund",
          onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            setAnchorEl(null);
            setPendingNavigation("/policy/refund");
            setMenuOpenDrawer(false);
          },
          icon: <RefundIcon className="font-20 text-black mr-5" />,
        },
      ],
    },
    {
      id: 4,
      name: t("Menus.Contact"),
      mode: "contact",
      onClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        setAnchorEl(null);
        setPendingNavigation("/contact");
        setMenuOpenDrawer(false);
      },
    },
  ];

  return menuItems;
};
