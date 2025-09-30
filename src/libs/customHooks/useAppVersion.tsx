import React, { useEffect, useState } from 'react'
import { getData, storeData } from '../../utils/localstorage';

const useAppVersion = () => {
    const [currentVersion, setCurrentVersion] = useState(null);

    useEffect(() => {
        const checkVersion = async () => {
            try {
                const response = await fetch('/version.json', { cache: 'no-store' });
                const data = await response.json();
                const storedVersion = await getData('app_version');
                if (storedVersion && storedVersion !== data.version) {
                    localStorage.clear();
                    caches.keys().then(cacheNames => cacheNames.forEach(cacheName => caches.delete(cacheName)));
                    window.location.reload();
                } else {
                    await storeData('app_version', data.version);
                    setCurrentVersion(data.version);
                }
            } catch (error) {
            }
        }

        const interval = setInterval(checkVersion, 15 * 60 * 1000);
        checkVersion();

        return () => clearInterval(interval);
    }, [])

    return currentVersion;
}

export default useAppVersion