import errorStyles from "./error.module.scss"
import { useNavigate } from 'react-router-dom'
import notFoundImg from "../../assets/images/pageNotFound.png"

const RouteError = () => {
  const navigate = useNavigate();
  return (
    <div className={errorStyles.container}>
      <div className={errorStyles.textWrapper}>
        <img src={notFoundImg} alt='page not found' className={errorStyles.noDataImg} />
        <div className={errorStyles.errorText}>
          The page you are looking for is not found. Please click the below
          homepage button.
        </div>
        <div
          className={errorStyles.homeBtn}
          onClick={() => navigate("/")}
        >
          <div className={errorStyles.homeButtonA}>Go to previous page</div>
        </div>
      </div>
    </div>
  )
}

export default RouteError;