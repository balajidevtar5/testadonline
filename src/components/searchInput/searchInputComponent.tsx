import { Clear, SearchOutlined } from "@mui/icons-material";
import { Box, CircularProgress, IconButton, Input, InputAdornment } from "@mui/material";
import { MAIN_COLOR } from "../../config/theme";
import React, { forwardRef, useContext, useRef, useState } from "react";
import { LayoutContext } from "../layout/LayoutContext";

export interface SearchInputComponentProps {
    handleSearch?: any;
    handleClearInput?: any;
    placeholder?: string;
    suffixClassName?: string;
    value?: string;
    inputValue?: any;
    className?: any;
    prefix?: boolean;
    onClick?: () => void;  // Added onClick handler prop
    onKeyDown?: (e: React.KeyboardEvent) => void;
    isLoading?: boolean;
}

export const SearchInputComponent = forwardRef<HTMLInputElement, SearchInputComponentProps>((props, ref) => {
    const { handleSearch, placeholder, value, prefix = true, handleClearInput, inputValue, className, onClick, suffixClassName, onKeyDown, isLoading } = props;
    const { isDarkMode } = useContext(LayoutContext);
    const isMobile = window.innerWidth <= 768;
    
    const lastClickTimeRef = useRef(0);
    const [isFocused, setIsFocused] = useState(false);

    const handleInputClick = () => {
        const currentTime = Date.now();
        // Only call onClick if more than 500ms have passed since last call
        if (currentTime - lastClickTimeRef.current) {
            lastClickTimeRef.current = currentTime;
            if (typeof onClick === "function") {
                onClick();
            }
        }
    };

    return (
        <Input
            placeholder={placeholder}
            onChange={(e: any) => {
                if (typeof handleSearch === "function") {
                    handleSearch(e);
                }
            }}
            onKeyDown={onKeyDown}
            onPaste={(e: any) => {
                e.stopPropagation();
            }}
            onCopy={(e: any) => {
                e.stopPropagation();
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`searchInput ${className} ${isFocused ? "searchInput--focused" : ""}`}
            startAdornment={
                prefix && (
                    <InputAdornment position="start" className={className}>
                        <Box display="flex" alignItems="center" gap="6px">
                            <SearchOutlined
                                sx={{
                                    color: isFocused
                                        ? MAIN_COLOR
                                        : isDarkMode
                                            ? "#a8a8a8"
                                            : "#63636370",
                                    width: "20px",
                                    height: "20px",
                                    transition: "color 0.2s"
                                }}
                            />
                        </Box>
                    </InputAdornment>
                )
            }
            endAdornment={
                <InputAdornment
                    position="end"
                    sx={isMobile ? { paddingRight: "28px" } : undefined}
                >
                    <Box display="flex" alignItems="center" gap="6px">
                    {inputValue && (
                        <IconButton onClick={handleClearInput} className={suffixClassName}>
                            {isLoading ? (
                                <CircularProgress size={12} style={{ color: isDarkMode ? "#fff" :MAIN_COLOR}} />
                            ) :
                                <Clear sx={{
                                    color: "#fff", width: "15px", height: "15px", background: MAIN_COLOR, borderRadius: "50%",
                                    p: "2px"
                                }} />}
                        </IconButton>
                    )}
                    </Box>
                </InputAdornment>
            }
            value={inputValue}
            disableUnderline={true}
            sx={{ display: "flex", ml: "10px", alignItems: "center" }}
            onClick={handleInputClick}  // Use the new handler
            inputRef={ref}
        />
    );
});