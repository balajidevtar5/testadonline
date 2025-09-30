import { useTranslation } from "react-i18next";
import NoDataImage from "../../assets/images/NoDataImage.jpg";
import NoDataStyles from "./NoDataStyles.module.scss";

const NoDataFoundComponent = () => {
    const { t } = useTranslation();
    return (
        <>
            <div className={`${NoDataStyles.nodata}`}>
                <img src={NoDataImage} alt='no data found' width="250" />
                <p className="text-center mt-5">{t("General.No data found")}</p>
            </div>
        </>
    );
};

export default NoDataFoundComponent;
