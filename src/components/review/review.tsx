import React, { useContext, useState, useEffect, useRef } from "react";
import { Button, message } from "antd";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import { IconButton } from "@mui/material";
import { useTranslation } from "react-i18next";
import { LayoutContext } from "../../components/layout/LayoutContext";
import BottomNavigationComponent from "../../components/bottomNavigation/bottomNavigation";
import AdSuccessStyles from "./AdSuccessStyles.module.scss";
import CheckIcon from '@mui/icons-material/Check';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { submitUserRating } from "../../redux/slices/ratingSlice";
import { API_ENDPOINT_PROFILE } from "../../libs/constant";
import { getData, removeItem, storeData } from "../../utils/localstorage";
import { getListAPI } from "../../redux/services/post.api";
import Fancybox from "../fancybox/fancyBox";
import ShareOutlined from "@mui/icons-material/ShareOutlined";

interface LocationState {
    postId?: number;
    languageId?: number;
    premiumadurls?: string;
}

const AdSuccessScreen = () => {
    const { t } = useTranslation();
    const { isDarkMode } = useContext(LayoutContext);
    const [rating, setRating] = useState<number>();
    const [copied, setCopied] = useState(false);
    const [premiumUrl, setPremiumUrl] = useState(null);
    const [postedData, setPostedData] = useState(null);
    const [showPostImages, setPostImages] = useState(false)
    const [shareUrl, setShareUrl] = useState<string>("");
    const [slideData, setSlideData] = useState([])
    const playStoreUrl = "https://play.google.com/store/apps/details?id=com.techavidus.adonline";
    const appStoreUrl = "https://apps.apple.com/us/app/adonline-in-buy-sell-app/id6590616607";
    const dispatch = useDispatch();
    const location = useLocation();
    const state = location.state as LocationState;
    const postId = state?.postId || 7011;
    const languageId = state?.languageId || 2;
    const [premiumAdImage, setPremiumAdImage] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [feedback, setFeedback] = useState<string>("");
    const [feedbackError, setFeedbackError] = useState<string>("");

    // 🔁 Fix: useRef to persist premiumadurls even if state is undefined on rerender
    const premiumUrlRef = useRef<string | null>(state?.premiumadurls || null);

    // Handle share functionality
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: t("General.AdCreatedSuccessfully"),
                url: shareUrl || window.location.href,
            }).catch(() => {
                message.info(t("General.ShareNotSupported"));
            });
        } else {
            message.info(t("General.ShareNotSupported"));
        }
    };

    const handleCopy = (textToCopy: string) => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getDeviceType = (): "Android" | "iOS" | "Desktop" => {
        const userAgent = navigator.userAgent.toLowerCase();
        if (/android/.test(userAgent)) return "Android";
        else if (/iphone|ipad|ipod/.test(userAgent)) return "iOS";
        return "Desktop";
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl || window.location.href);
        message.success(t("General.sharePostUrlCopied"));
    };

    const navigate = useNavigate();

    const isIOS = (): boolean => {
        const userAgent = navigator.userAgent || navigator.vendor || '';
        const isAppleDevice = /iPad|iPhone|iPod/.test(userAgent);
        const hasTouchAndMacintosh = ('ontouchend' in document) && /Mac/.test(userAgent);
        const hasIOSSpecificAPIs = 'standalone' in navigator && (navigator as any).standalone !== undefined;
        return isAppleDevice || hasTouchAndMacintosh || hasIOSSpecificAPIs;
    };

    
    const isTWA = () => {
        return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches && /android/i.test(navigator.userAgent));
    };

    
    const shouldShowReviewPrompt = async (options?: { maxPerYear?: number; storageKey?: string }): Promise<boolean> => {
        const maxPerYear = options?.maxPerYear ?? 3;
        const storageKey = options?.storageKey ?? "reviewPromptData";
        try {
            const now = new Date();
            const currentYear = now.getFullYear();
            const raw: any = await getData(storageKey);
            let data: { year: number; count: number } = (raw && typeof raw.year === "number" && typeof raw.count === "number")
                ? raw
                : { year: currentYear, count: 0 };

            if (typeof data?.year !== "number" || typeof data?.count !== "number") {
                data = { year: currentYear, count: 0 };
            }

            if (data.year !== currentYear) {
                data = { year: currentYear, count: 0 };
            }

            if (data.count < maxPerYear) {
                data.count += 1;
                data.year = currentYear;
                await storeData(storageKey, data);
                return true;
            }
            return false;
        } catch {
            return false;
        }
    };

    

    
    const triggerIOSReview = () => {
        const win: any = window as any;
        try {
            if (win?.webkit?.messageHandlers?.triggerReview) {
                win.webkit.messageHandlers.triggerReview.postMessage(null);
                return;
            }
        } catch (e) {
            console.error("Error triggering iOS review:", e);
        }
        window.open(`${appStoreUrl}?action=write-review`, "_blank");
    };

    const premiumImageOpen = (premiumUrl) => {
        setSlideData([]);
        if (premiumUrl) {
            const slideData = { key: 1, image: premiumUrl };
            setPostImages(true);

            setSlideData([slideData]);
            setTimeout(() => {
                const images: any = document.querySelectorAll(
                    "a[data-fancybox='gallery']"
                );
                if (images?.length > 0) {
                    images[0].click();
                }
            }, 500);
        }
    }

    const handleRatingChange = (newRating: number) => {
        if (newRating === rating) return; 
        setRating(newRating);
        if (newRating > 3) {
            setFeedback("");
            setFeedbackError("");
            // For 4-5 stars, call API immediately
            const payload: any = {
                Rating: newRating,
                PostId: postId,
                Device: getDeviceType(),
                LanguageId: languageId,
            };
            const handleSuccess = () => message.success(t("toastMessage.submitSuccess"));
            const handleError = () => message.error(t("toastMessage.submitError"));
            dispatch(submitUserRating(payload) as any)
                .then(async () => {
                    handleSuccess();
                    if (isIOS()) {
                        if (await shouldShowReviewPrompt()) {
                            triggerIOSReview();
                        }
                    } else if (isTWA()) {
                        window.location.href = "myapp://review";
                    } else {
                        window.open(playStoreUrl, "_blank");
                    }
                })
                .catch(handleError);
        } else {
            // For 1-3 stars, just show textarea and button, do not call API yet
            setFeedback("");
            setFeedbackError("");
        }
    };

    const handleSubmitRating = () => {
        if ((rating || 0) <= 3 && !feedback.trim()) {
            setFeedbackError(t("General.FeedbackRequired"));
            return;
        }
        setFeedbackError("");
        const payload: any = {
            Rating: rating,
            PostId: postId,
            Device: getDeviceType(),
            LanguageId: languageId,
            Feedback: feedback.trim(),
        };
        const handleSuccess = () => message.success(t("toastMessage.submitSuccess"));
        const handleError = () => message.error(t("toastMessage.submitError"));
        dispatch(submitUserRating(payload) as any)
            .then(handleSuccess)
            .catch(handleError);
    };

    useEffect(() => {
        const getAdUpdateData = async () => {
            try {
                const adUpdateResponse = await getData("adUpdateResponse");

                if (adUpdateResponse) {
                    // Parse premium ad URLs for image
                    const parsedData = adUpdateResponse?.premiumadurls ? JSON.parse(adUpdateResponse?.premiumadurls) : null;
                    if (parsedData?.LargeImage) {
                        const imagePath = parsedData.LargeImage ? parsedData.LargeImage.replace(/^~/, "") : "";
                        const imageUrl = `${API_ENDPOINT_PROFILE}${imagePath}`;
                        setPremiumUrl(imageUrl);
                    }
                    setPostedData(adUpdateResponse)

                    // Set share URL from response
                    if (adUpdateResponse?.shareposturl) {
                        setShareUrl(adUpdateResponse?.shareposturl);
                    }
                }
            } catch (error) {
                console.error("Error processing adUpdateResponse:", error);
            } finally {
                setLoading(false);
            }
        };

        getAdUpdateData();
    }, []);

    // ✅ FIXED useEffect: parse once and persist image
    useEffect(() => {
        try {
            if (premiumUrlRef.current) {
                const parsed = JSON.parse(premiumUrlRef.current);
                const imagePath = parsed?.LargeImage?.replace(/^~\//, '');
                if (imagePath) {
                    setPremiumAdImage(`https://adonline.in/${imagePath}`);
                }
            }
        } catch (err) {
            console.error("Error parsing premiumadurls:", err);
        } finally {
            setLoading(false);
        }
        window.scrollTo(0, 0);

    }, []);

    return (
        <div
            className={AdSuccessStyles.successContainer}
            style={{
                paddingBottom: "10px",
                backgroundColor: isDarkMode ? "#313131" : "#f5f5f5",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
           
            <div className={AdSuccessStyles.contentWrapper} style={{ marginBottom: "20%", overflowY: "scroll", minHeight: "100vh", }}>
                <div className={AdSuccessStyles.successTitle} style={{ color: "#4CAF50", textAlign: "center", marginBottom: "20px" }}>
                    {t("General.AdCreatedSuccessfully")}
                </div>
                <div className={AdSuccessStyles.buttonRow}>
                    <div className={AdSuccessStyles.buttonWrapper}>
                        <Button
                            type="primary"
                            onClick={handleShare}
                            className={AdSuccessStyles.shareButton}
                            style={{ backgroundColor: "#FF6E00", borderColor: "#FF6E00", height: "44px", width: "100%", borderRadius: "7px" }}
                        >
                            <ShareOutlined style={{ fontSize: "20px", marginRight: "8px", color:"fff" }} />
                            {t("Share")}
                        </Button>
                    </div>
                    <div className={AdSuccessStyles.buttonWrapper}>
                        <Button
                            icon={copied ? <CheckIcon style={{ fontSize: "20px", marginRight: "8px", color: "#4CAF50" }} /> : <ContentCopyOutlinedIcon style={{ fontSize: "20px", marginRight: "8px" }} />}
                            onClick={() => { handleCopyLink(); handleCopy(shareUrl || window.location.href); }}
                            className={AdSuccessStyles.copyButton}
                            style={{
                                borderColor: "#d9d9d9",
                                color: isDarkMode ? "#fff" : "#000",
                                height: "44px",
                                width: "100%",
                                borderRadius: "7px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            {copied ? t("General.copied") : t("General.copy")}
                        </Button>
                    </div>
                </div>

                <div className={AdSuccessStyles.shareText} style={{ color: "#FF6E00", textAlign: "center", marginBottom: "20px" , maxWidth:"75%" }}>
                    {t("General.ShareOnSocialMedia")}
                </div>


                {postedData?.availableforrating === 1 &&
                    <div className={AdSuccessStyles.ratingCard} style={{
                        backgroundColor: isDarkMode ? "#242424" : "#fff",
                        padding: "16px",
                        borderRadius: "8px",
                        width: "100%",
                        marginBottom: "20px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
                    }}>
                        <div style={{ color: isDarkMode ? "#fff" : "#000", textAlign: "center", marginBottom: "8px" }}>
                            {t("General.RateExperience")}
                        </div>
                        <div style={{ color: isDarkMode ? "#fff" : "#000", fontWeight: "bold", fontSize: "18px", textAlign: "center", marginBottom: "12px" }}>
                            {t("General.RateAndReview")}
                        </div>

                        {/* Stars Container */}
                        <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <div
                                    key={star}
                                    onClick={() => handleRatingChange(star)}
                                    style={{
                                        color: star <= (rating || 0) ? "#FFD700" : "#d9d9d9",
                                        fontSize: "32px",
                                        cursor: "pointer",
                                        padding: "0 4px",
                                        flex: 1,
                                        display: "flex",
                                        justifyContent: "center"
                                    }}
                                >
                                    ★
                                </div>
                            ))}
                        </div>

                        {/* Rating Labels */}
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            {[1, 2, 3, 4, 5].map((star) => {
                                const labels = [
                                    t("General.RatingVeryBad"),
                                    t("General.RatingBad"),
                                    t("General.RatingAverage"),
                                    t("General.RatingGood"),
                                    t("General.RatingVeryGood")
                                ];

                                return (
                                    <div
                                        key={`label-${star}`}
                                        style={{
                                            fontSize: "10px",
                                            color: star <= (rating || 0) ? (isDarkMode ? "#FFD700" : "#FF6E00") : "#999",
                                            textAlign: "center",
                                            padding: "0 4px",
                                            flex: 1,
                                            fontWeight: star <= (rating || 0) ? "bold" : "normal"
                                        }}
                                    >
                                        {labels[star - 1]}
                                    </div>
                                );
                            })}
                        </div>
                        {/* Feedback Textbox and Submit Button for 1-3 stars */}
                        {(rating || 0) > 0 && (rating || 0) <= 3 && (
                            <div style={{ marginTop: "16px" }}>
                                <div style={{ color: isDarkMode ? "#fff" : "#000", fontSize: "14px", marginBottom: "4px" }}>
                                    {t("General.FeedbackPrompt")}
                                </div>
                                <textarea
                                    value={feedback}
                                    onChange={e => setFeedback(e.target.value)}
                                    placeholder={t("General.FeedbackPlaceholder")}
                                    style={{
                                        width: "95%",
                                        minHeight: "60px",
                                        borderRadius: "6px",
                                        border: feedbackError ? "1px solid #ff4d4f" : "1px solid #d9d9d9",
                                        padding: "8px",
                                        fontSize: "14px",
                                        resize: "vertical",
                                        marginBottom: feedbackError ? "4px" : "12px",
                                        backgroundColor: isDarkMode ? "#313131" : "#FFFFFF",
                                        color: isDarkMode ? "#CCCCCC" : "#313131"
                                    }}
                                />
                                {feedbackError && (
                                    <div style={{ color: "#ff4d4f", fontSize: "12px", marginBottom: "8px" }}>{feedbackError}</div>
                                )}
                                <Button
                                    type="primary"
                                    onClick={handleSubmitRating}
                                    style={{
                                        marginTop: "12px",
                                        width: "100%",
                                        backgroundColor: "#FF6E00",
                                        borderColor: "#FF6E00",
                                        borderRadius: "7px",
                                        height: "40px"
                                    }}
                                >
                                    {t("General.SubmitRating")}
                                </Button>
                            </div>
                        )}
                    </div>
                }

                {/* Bottom section / Advertisement */}
                {
                    premiumUrl && (
                        <div
                            className={AdSuccessStyles.adBanner}
                            style={{ backgroundColor: isDarkMode ? "#242424" : "#F0EDE5", padding: "16px", borderRadius: "8px", width: "100%", textAlign: "center" }}
                        >
                            <div style={{ color: "#5A5A5A" , maxHeight : "300px"}}>
                                <img
                                    src={premiumUrl}
                                    alt="Upload icon"
                                    className="premium-ad-img fitContent"
                                    onClick={() => { premiumImageOpen(premiumUrl) }}
                                />
                            </div>
                        </div>
                    )
                }

                {premiumAdImage && (
                    <div className={AdSuccessStyles.adBanner} style={{
                        backgroundColor: "#F0EDE5",
                        padding: "16px",
                        borderRadius: "8px",
                        width: "100%",
                        textAlign: "center",
                        minHeight: "200px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        {loading ? (
                            <div>Loading...</div>
                        ) : (
                            <img
                                src={premiumAdImage}
                                alt="Premium Ad"
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: "100%",
                                    objectFit: "contain",
                                    borderRadius: "4px"
                                }}
                                onError={() => setPremiumAdImage("")}
                            />
                        )}
                    </div>
                )}
            </div>

            {/* <div className="fixed bottom-0 left-0 right-0 z-50">
                <BottomNavigationComponent />
            </div> */}

            {showPostImages && (
                <Fancybox>
                    {slideData.map((elm, index) => (
                        <a
                            data-fancybox="gallery"
                            href={elm.image}
                            key={`fancybox-${index}`}
                        />
                    ))}
                </Fancybox>
            )}
        </div>
    );
};

export default AdSuccessScreen;
