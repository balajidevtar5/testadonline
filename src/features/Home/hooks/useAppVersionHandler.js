import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAppVersionApi } from '../../../redux/services/setting.api';
import { CURRENT_VERSION } from '../../../libs/constant';

const useAppVersionHandler = () => {
  const [latestVersion, setLatestVersion] = useState(null);
  const [showOpenAppButton, setShowOpenAppButton] = useState(false);
  const navigate = useNavigate();

  // Platform detection
  const isIOS = useCallback(() => /iPhone|iPad|iPod/i.test(navigator.userAgent), []);
  const isAndroid = useCallback(() => /Android/i.test(navigator.userAgent), []);
  const isAndroidChrome = useCallback(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    return (
      /android/.test(userAgent) &&
      /chrome/.test(userAgent) &&
      !/edge|opr\//.test(userAgent)
    );
  }, []);
  const isStandalone = useCallback(() => window.matchMedia("(display-mode: standalone)").matches, []);

  // Open App Button logic
  const shouldShowOpenAppButton = useCallback(() => {
    if (!isStandalone() && isAndroidChrome()) {
      return (
        window.innerWidth <= 800 &&
        window.innerHeight <= 1200 &&
        "ontouchstart" in window
      );
    }
    return false;
  }, [isStandalone, isAndroidChrome]);

  // Fetch app version
  const fetchAppVersion = useCallback(async () => {
    const response = await getAppVersionApi();
    if (response.success) {
      setLatestVersion(response.data[0].androidappversion);
    }
  }, []);

  // Redirect logic
  const redirectToAppOrPlayStore = useCallback(() => {
    if (isIOS()) {
      window.location.href = "AdOnline.in://";
    } else {
      window.location.href =
        "intent://adonline.in#Intent;scheme=https;package=com.techavidus.adonline;end;";
    }
  }, [isIOS]);

  // Effects
  useEffect(() => {
    setShowOpenAppButton(shouldShowOpenAppButton());
  }, [shouldShowOpenAppButton]);

  useEffect(() => {
    if (isStandalone()) {
      fetchAppVersion();
    }
  }, [isStandalone, fetchAppVersion]);

  useEffect(() => {
    if (isStandalone() && latestVersion && CURRENT_VERSION < latestVersion) {
      navigate("/update");
    }
  }, [latestVersion, navigate, isStandalone]);

  return {
    latestVersion,
    showOpenAppButton,
    isIOS,
    isAndroid,
    isAndroidChrome,
    isStandalone,
    redirectToAppOrPlayStore,
  };
};

export default useAppVersionHandler;