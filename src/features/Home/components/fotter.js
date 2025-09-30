import React from 'react'
import { Android_Website_app_url, IOS_app_url } from '../../../libs/constant';
import { isRunningAsPWA } from '../../../utils/pwaUtils';
import playstore from "./../../../assets/images/playstore.png";
import AppStoreIcon from "../../../assets/icons/download-on-the-app-store-apple-logo.svg";

export const Fotter = () => {
      const showPlayStoreIcon = !isRunningAsPWA();
    
  return (
    <div>
                <div className="d-flex justify-content-between align-items-center">
                  <p className="mt-0 mb-0">All rights reserved © 2025 AdOnline.in</p>
                  <div
                    className="d-flex align-items-center "
                    style={{ height: "35px" }}
                  >
                    <div>
                      {showPlayStoreIcon && (
                        <a
                          href={Android_Website_app_url}
                          target="_blank"
                          className="d-flex"
                        >
                          <img src={playstore} className="mr-10" />
                        </a>
                      )}
                    </div>
                    <div>
                      {showPlayStoreIcon && (
                        <a href={IOS_app_url} target="_blank" className="d-flex">
                          <img src={AppStoreIcon} width="90" />
                        </a>
                      )}
                    </div>
                    {/* <a href="https://apps.apple.com/app/YOUR_APP_NAME/id123456789" target='_blank'><img src={appstore} /></a> */}
                  </div>
                </div>
    </div>
  )
}
