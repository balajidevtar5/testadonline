import React, { useContext, useEffect, useState } from 'react';
import {
  IconButton,
  InputBase,
  ClickAwayListener,
  useTheme,
  useMediaQuery,
} from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import CloseIcon from "@mui/icons-material/Close";
import { FieldTimeOutlined, UnorderedListOutlined, AppstoreOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { SearchInputComponent } from "../../../components/searchInput/searchInputComponent";
// import { AnimatedSearchBox } from "../styles";
import { Badge, Tooltip } from "antd";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LightModeIcon from '@mui/icons-material/LightMode';
import { NotificationBell } from './notificationBell';
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import './navigationActions.scss';
import { useSelector } from 'react-redux';
import MessageIcon from '@mui/icons-material/Message';
// Utility Functions
const isHomePage = (pathname) => {
  const homePages = ["/", "/home", "/BETA/web", "/BETA/web/home"];
  return homePages.includes(pathname) || homePages.includes(pathname.toLowerCase());
};

const validateSearchInput = (e, currentValue) => {
  // Block numbers if the input is empty or starts with a number
  if (/^\d$/.test(e.key) && !/[a-zA-Z]/.test(currentValue)) {
    e.preventDefault();
  }
  // Block special characters (allow only letters, numbers, spaces, backspace, arrow keys, etc.)
  if (!/^[a-zA-Z0-9\s]$/.test(e.key) &&
    !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
    e.preventDefault();
  }
};

// Reusable Search History Dropdown Component
const SearchHistoryDropdown = ({
  searchHistory,
  onHistoryClick,
  onDeleteHistory,
  deleteSearchHostory,
  isMobile = false,
  searchHistoryRef = null
}) => {
  const { t } = useTranslation();
  const maxLength = isMobile ? 40 : 20;
  const containerClass = isMobile
    ? "search-history-dropdown d-xs-block d-none"
    : "search-history-dropdown d-xs-none";

  return (
    <div className={containerClass} ref={searchHistoryRef}>
      <div className="pl-10 d-flex align-items-center mb-0">
        <FieldTimeOutlined className={`font-20 font-bold   ${isMobile ? 'mr-10' : 'mr-5 mt-14'}`} style={{ color: "#ff780c" }} />
        <p className={`font-14 mb-0 font-bold ${isMobile ? 'mt-0' : ''}`}>{t("General.Recent History")}</p>
      </div>
      {searchHistory?.length > 0 ? (
        <ul className="search-history-list mb-0 mt-0">
          {searchHistory.map((item, index) => (
            <li
              key={index}
              className="search-history-item cursor-pointer"
            >
              <div className="d-flex align-items-center justify-content-between">
                <div
                  onClick={(e) => onHistoryClick(item?.searchtext)}
                  className="d-flex gap w-100"
                >
                  {item?.searchtext && typeof item?.searchtext === "string"
                    ? item.searchtext?.length > maxLength
                      ? `${item.searchtext.substring(0, maxLength)}...`
                      : item.searchtext
                    : "No search text"}
                </div>
                <CloseOutlined
                  onClick={(e) => deleteSearchHostory(item, e)}
                  className="font-20 text-grey-100"
                />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-history">No recent search</p>
      )}
    </div>
  );
};

// Reusable Voice Icon Component
const VoiceIcon = ({ isListening, startListening, stopListening, className = "" }) => (
  <div className={className}>
    <KeyboardVoiceIcon
      onClick={() => isListening ? stopListening() : startListening()}
      className={isListening ? "listening" : ""}
      style={{
        background: "white",
        color: "green",
        border: "none",
        borderRadius: "50%",
        cursor: "pointer",
        fontSize: "20px",
      }}
    />
  </div>
);

// Desktop Search Component
const DesktopSearch = ({
  searchValue,
  setSearchValue,
  handleClearInput,
  handleSearchData,
  filterValue,
  setIsPostClear,
  setIsLoading,
  isPostDataLoading,
  isListening,
  startListening,
  stopListening,
  isDarkMode,
  location,
  isSearchHistoryVisible,
  searchHistory,
  handleHistoryClick,
  handleClickAway,
  deleteSearchHostory
}) => {
  const { t } = useTranslation();
  if (!isHomePage(location.pathname)) return null;

  return (
    <div className="position-relative">
      <div className="w-100 searchInput">
        <div className="wd-175px d-xs-none search-input">
          <SearchInputComponent

            onKeyDown={(e) => {
              validateSearchInput(e, e.target.value);
            }}
            handleSearch={(e) => {
              const value = e.target.value;
              if (value === '') {
                setSearchValue(value);
                return;
              }
              // Only allow input if it's not just spaces at the start
              if (value.trim() === '' && value.length > 0) {
                return;
              }
              // If there's content already, allow spaces
              if (searchValue.trim() !== '') {
                setSearchValue(value);
                return;
              }
              // For new input, prevent leading spaces
              if (value.trim() !== '') {
                setSearchValue(value.trimStart());
              }
            }}
            handleClearInput={() => {
              handleClearInput();
              setIsLoading(false);
            }}
            onClick={() => {
              handleSearchData();
            }}
            inputValue={searchValue}
            value={filterValue?.Search}
            placeholder={t("General.Search text...")}
            suffixClassName="mr-15"
            isLoading={isPostDataLoading}
          />
        </div>
      </div>

      <VoiceIcon
        isListening={isListening}
        startListening={startListening}
        stopListening={stopListening}
        className="desktopsearchmickeicon"
      />

      {/* Show history only when user types something */}
      {window.innerWidth > 768 && isSearchHistoryVisible && searchHistory?.length > 0 && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <SearchHistoryDropdown
            searchHistory={searchHistory}
            onHistoryClick={handleHistoryClick}
            deleteSearchHostory={deleteSearchHostory}
            isMobile={false}
          />
        </ClickAwayListener>
      )}
    </div>
  );
};

// Main SearchSection Component
export const SearchSection = ({
  isSearchOpen,
  searchValue,
  setSearchValue,
  handleSearch,
  handleClearInput,
  handleSearchData,
  isPostDataLoading,
  isSearchHistoryVisible,
  searchHistory,
  handleHistoryClick,
  deleteSearchHostory,
  handleClickAway,
  isListening,
  startListening,
  stopListening,
  isDarkMode,
  location,
  inputRef,
  searchHistoryRef,
  searchHistoryMobileRef,
  filterValue,
  setIsPostClear,
  setIsLoading,
  notificationCount,
  isLocationPermissionGiven,
  NotificationPermissionAccess,
  setIsAppNotification,
  handleThemeClick,
  youtubeLink,
  selectedGridOption,
  handleDesignOptionClick,
  tooltipVisible,
  setTooltipVisible,
  setIsLoginModalOpen,
  handleChatClick,
  messageCount
}) => {
  const { t } = useTranslation();
  const { data: loginUserData } = useSelector((state) => state.loginUser);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


  return (
    <div className="d-flex align-items-center navigation-gap">
      <DesktopSearch
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        handleClearInput={handleClearInput}
        handleSearchData={handleSearchData}
        filterValue={filterValue}
        setIsPostClear={setIsPostClear}
        setIsLoading={setIsLoading}
        isPostDataLoading={isPostDataLoading}
        isListening={isListening}
        startListening={startListening}
        stopListening={stopListening}
        isDarkMode={isDarkMode}
        deleteSearchHostory={deleteSearchHostory}
        location={location}
        isSearchHistoryVisible={isSearchHistoryVisible}
        searchHistory={searchHistory}
        handleHistoryClick={handleHistoryClick}
        handleClickAway={handleClickAway}
      />

        <NotificationBell
          notificationCount={notificationCount}
          isLocationPermissionGiven={isLocationPermissionGiven}
          NotificationPermissionAccess={NotificationPermissionAccess}
          isDarkMode={isDarkMode}
          setIsAppNotification={setIsAppNotification}
          loginUserData={loginUserData}
          setIsLoginModalOpen={setIsLoginModalOpen}
        />

      <a href="#" className="mr-10 top3">
        <LightModeIcon onClick={handleThemeClick} className={`${isDarkMode ? "text-grey-800" : "text-grey"} font-24`} />
      </a>
      {
        !isMobile &&
        <div className="mr-10 top3 cursor-pointer">
        <Badge count={messageCount} size="small" color='red' style={{width: "16px", height: "16px", borderRadius: "50%"}} offset={[-3, 2]} onClick={handleChatClick}>
          <MessageIcon className="svg-width" onClick={handleChatClick} />
        </Badge>

      </div>
      }
      

      <Tooltip
        placement="bottom"
        title={selectedGridOption === 1 ? t("General.Switch to Grid View") : t("General.Switch to List View")}
        open={tooltipVisible}
      >
        <a
          className="mr-10"
          href="#"
          onClick={() => handleDesignOptionClick(selectedGridOption === 1 ? 2 : 1)}
          onMouseEnter={() => setTooltipVisible(true)}
          onMouseLeave={() => setTooltipVisible(false)}
        >
          {selectedGridOption === 1 ? (
            <UnorderedListOutlined onClick={() => setTooltipVisible(false)} className="font-22 text-primary" />
          ) : (
            <AppstoreOutlined onClick={() => setTooltipVisible(false)} className="font-22 text-primary" />
          )}
        </a>
      </Tooltip>
    </div>
  );
};