import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { message } from "antd";
import { toBlob } from "html-to-image";
import { LOGEVENTCALL, logEvents, NEW_APPURL, WHATSAPP_CHANNEL } from "../../../libs/constant";
import * as html2canvas from "html2canvas"; 

const useSharePost = (logEffect) => {
  const { t } = useTranslation();

const sharePost = useCallback(async(elm,selectedOption) => {
  const element = document.getElementById("share-template");
  if (!element) return;

  element.style.display = "block";

  const canvas = await html2canvas.default(element, { useCORS: true });
  const dataUrl = canvas.toDataURL("image/png");

   element.style.display = "none";
  if (navigator.canShare) {
    const decodedUrl = "https://testadonline-1pem.vercel.app/api/share/369";

    if(selectedOption === "withoutImage"){
  let textContent = `
*${t("ad_posted")}*\n
*${elm?.title}*
${elm?.shortdescription} \n`;

    if (elm?.price) {
      textContent += `${t("price_label")} : ${elm?.price} \n`;
    }

    textContent += `${t("location_label")} : ${elm?.location} \n
${t("contact_details")}\n${decodedUrl} \n
${t("download_app")}\n ${NEW_APPURL}\n
${t("join_whatsapp")}\n ${WHATSAPP_CHANNEL} \n`;

    navigator
      .share({
        url:"https://testadonline-1pem.vercel.app/api/share/369"
      })
      .then(() => {
        if (LOGEVENTCALL) {
          logEffect(logEvents.Share_Post);
        }
      })
      .catch((error) => {
        // Handle error silently or log if needed
      });
    }else{
      const res = await fetch(dataUrl);
    const decodedUrl = decodeURIComponent(elm?.shareposturl);
    const blob = await res.blob();
    const file = new File([blob], "post.png", { type: "image/png" });
    let textContent = `
${t("contact_details")}\n ${decodedUrl} \n
${t("download_app")}\n ${NEW_APPURL}\n
${t("join_whatsapp")}\n ${WHATSAPP_CHANNEL} \n`;

    textContent += `${t("contact_details")}\n ${decodedUrl} \n
${t("download_app")}\n ${NEW_APPURL}\n
${t("join_whatsapp")}\n ${WHATSAPP_CHANNEL} \n`;

    navigator
      .share({
        title: elm?.title,
        text: textContent,
        files: [file],
      })
      .then(() => {
        if (LOGEVENTCALL) {
          logEffect(logEvents.Share_Post);
        }
      })
      .catch((error) => {
        // Handle error silently or log if needed
      });
    }
  
  }
}, [logEffect, t]);


  return { sharePost };
};

export default useSharePost;

export const useReferralShare = () => {
  
  const { t } = useTranslation();

  const getShareMessage = useCallback((referralUrl) => {
    return `
📢 ${t("refer_earn_title") || "Refer & Earn"}
🎁 ${t("refer_earn_subtitle") || "Get 500 points for every signup!"}
🔗 ${t("referral_code") || "Use my referral link"}:
${referralUrl}
    `;
  }, [t]);

  
  const shareReferral = useCallback((referralUrl,code) => {
    const fullMessage = `
📢 *${t("refer_earn_title") || "Refer & Earn"}*
🎁 *${t("refer_earn_subtitle") || "Get 500 points for every signup!"}*

🔑 *${t("referelCodeText")}* ${code}

📲 ${t("download_app") || "Download our app"}:
${NEW_APPURL}

💬 ${t("join_whatsapp") || "Join our WhatsApp channel"}:
${WHATSAPP_CHANNEL}
`.trim();


    if (navigator.share) {
      navigator
        .share({
          title: "AdOnline – Refer & Earn",
          text: fullMessage,
        })
        .catch((err) => {
        });
    } else {
      message.info(t("General.ShareNotSupported") || "Sharing is not supported on this device.");
    }
  }, [t]);

  const shareReferralWithQr = useCallback(async (referralUrl, qrRef) => {
    const messageText = getShareMessage(referralUrl);

    if (!qrRef?.current) return;
    const blob = await toBlob(qrRef.current);
    if (!blob) return;
    const file = new File([blob], "referral-qr.png", { type: "image/png" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: "Earn with AdOnline!",
          text: messageText,
          files: [file],
        });
      } catch (err) {
        console.error("QR Share failed", err);
        message.info(t("General.ShareNotSupported"));
      }
    } else {
      message.info(t("General.ShareNotSupported"));
    }
  }, [getShareMessage, t]);

  return { shareReferral,  shareReferralWithQr, getShareMessage};
};

