import React, { useRef, useEffect } from 'react';
import { InputBase, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import { FieldTimeOutlined, CloseOutlined } from "@ant-design/icons";
import { ClickAwayListener } from "@mui/material";
import { styled } from "@mui/system";
import { useTranslation } from "react-i18next";
import { SearchInputComponent } from '../../../components/searchInput/searchInputComponent';

const AnimatedSearchBox = styled('div', {
  shouldForwardProp: (prop) => prop !== "open",
})(({ open }) => ({
  display: "flex",
  alignItems: "center",
  width: open ? "calc(100% - 30px)" : 0,
  transition: "width 0.3s ease",
  overflow: "hidden",
  marginLeft: "8px",
  padding: open ? "0 8px" : 0,
}));

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
  searchHistoryRef = null
}) => {
  const { t } = useTranslation();
  const maxLength = 40;

  return (
    <div className="search-history-dropdown d-xs-block d-none" ref={searchHistoryRef}>
      <div className="pl-10 d-flex align-items-center mb-0">
        <FieldTimeOutlined className="font-20 font-bold mr-10" style={{ color: "#ff780c" }} />
        <p className="font-14 mb-0 mt-0 font-bold">{t("General.Recent History")}</p>
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
                  onClick={(e) => onDeleteHistory(item, e)}
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

export const MobileSearchBox = ({
  location,
  isSearchOpen,
  searchValue,
  setSearchValue,
  handleClearInput,
  setIsLoading,
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
  handleToggle,
  inputRef: _inputRefProp, 
  searchHistoryRef,
  searchHistoryMobileRef,
  filterValue,
  setIsPostClear,
  isIOS
}) => {
  const { t } = useTranslation();

  const inputRef = useRef(null);

  useEffect(() => {
    if (isSearchOpen && inputRef.current && typeof window !== 'undefined' && window.innerWidth <= 768) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  if (!isHomePage(location.pathname)) return null;
  
  return (
    <div className="position-relative mobilesearchbox w-100">
      <ClickAwayListener onClickAway={handleClickAway}>
        <AnimatedSearchBox
          className="search-input-position w-100 hide-on-large-tablet"
          open={isSearchOpen}
          style={{ display: isSearchOpen ? "block" : "none" }}
        >
          <SearchInputComponent
            ref={inputRef}
            onKeyDown={(e) => {
              validateSearchInput(e, e.target.value);
            }}
            handleSearch={(e) => {
              const value = e.target.value;
              if (value === "") {
                setSearchValue(value);
                return;
              }
              // Only allow input if it's not just spaces at the start
              if (value.trim() === "" && value.length > 0) {
                return;
              }
              // If there's content already, allow spaces
              if (searchValue.trim() !== "") {
                setSearchValue(value);
                return;
              }
              // For new input, prevent leading spaces
              if (value.trim() !== "") {
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
            suffixClassName="clrSearch"
            isLoading={isPostDataLoading}
          />
          {!isIOS && (
            <VoiceIcon
              isListening={isListening}
              startListening={startListening}
              stopListening={stopListening}
              className="mobilesearchmickeicon"
            />
          )}
        </AnimatedSearchBox>
      </ClickAwayListener>

      {/* Only show history when user types something */}
      {isSearchHistoryVisible && isSearchOpen && searchHistory?.length > 0 && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <div
            className="search-history-container"
            ref={searchHistoryMobileRef}
          >
            <SearchHistoryDropdown
              searchHistory={searchHistory}
              onHistoryClick={handleHistoryClick}
              onDeleteHistory={deleteSearchHostory}
              searchHistoryRef={searchHistoryMobileRef}
            />
          </div>
        </ClickAwayListener>
      )}
    </div>
  );
};

