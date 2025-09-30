import { Close } from "@mui/icons-material"
import BottomNavigationComponent from "../bottomNavigation/bottomNavigation"
import { useContext, useEffect } from "react"
import { useTranslation } from "react-i18next";
import { LayoutContext } from "../layout/LayoutContext";
import bhavesh from '../../assets/images/BhaveshTarkhala.png'
import nalin from "../../assets/images/NalinThanki.png"
import jayeshpatel from "../../assets/images/jayeshpatel.png"


const AboutUs = () => {
    const { t } = useTranslation();
    // useEffect(() => {
    //     window.scrollTo(0, 0);
    // }, []);
    const { isDarkMode } = useContext(LayoutContext);

    return (
        <>
            <div className="primary-bold py-12 pb-xs-85">
      {/* <div className='d-flex align-items-center justify-content-between px-24 bg-lightPrimary '>
        <h3 className='mt-10 mb-10'><b>{t('About.1. Our Story')}</b></h3>
      </div> */}
      <div className='px-24'>
        <h4 className='mb-0'><b>{t('About.1. Our Story')}</b></h4>
        <p className='mt-10'>
          {t('About.Our Story Content', { platform: "AdOnline.in" })}
        </p>
        <h4 className='mb-0'><b>{t('About.2. What We Offer')}</b></h4>
        <p className='mt-10 mb-0'>
          {t('About.What We Offer Content Part 1', { platform: "AdOnline.in" })}
        </p>
        <p className='mt-10'>
          {t('About.What We Offer Content Part 2', { platform: "AdOnline.in" })}
        </p>
        <h4 className='mb-0'><b>{t('About.3. Why Choose Us?')}</b></h4>
        <ul className='pl-20 list-style-square'>
          <li className='mb-10'>{t('About.Why Choose Us Content.Transparency')}</li>
          <li className='mb-10'>{t('About.Why Choose Us Content.User-Centric')}</li>
          <li className='mb-10'>{t('About.Why Choose Us Content.Quality Listings')}</li>
          <li className='mb-10'>{t('About.Why Choose Us Content.Community', { platform: "AdOnline.in" })}</li>
        </ul>
        <h4 className='mb-0'><b>{t('About.4. Meet Our Team')}</b></h4>
        <p className='mt-10'>
          {t('About.Meet Our Team Content', { platform: "AdOnline.in" })}
        </p>
        <h4 className='mb-0'><b>{t('About.5. Get in Touch')}</b></h4>
        <p className='mt-10 mb-0'>{t('About.Get in Touch Content')}</p>
      </div>
      <section className="team-section px-24">
      <h2 className="team-heading">Our Founders</h2>
      <p className={`team-subheading ${isDarkMode ? "dark" : ""}`}>
      Our founders’ vision and innovation drive our company’s ongoing success.”
      </p>
      <div className="team-members">
        <div className="team-member">
          <img src={bhavesh} alt="Jeffrey Brown" className="team-image" />
          <h3 className={`team-name ${isDarkMode ? 'dark' : ''}`}>Bhavesh Tarkhala</h3>
          {/* <p className="team-role">creative leader</p> */}
          {/* <p className="team-description">
            Glavi amet ritnisl libero molestie ante ut fringilla purus eros quis glavrid from dolor amet iquam lorem bibendum.
          </p> */}
          <div className="team-socials">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>

        <div className="team-member">
          <img src={nalin} alt="Nalin Thanki" className="team-image" />
          <h3 className={`team-name ${isDarkMode ? 'dark' : ''}`}>Nalin Thanki</h3>
          {/* <p className="team-role">creative leader</p> */}
          {/* <p className="team-description">
            Glavi amet ritnisl libero molestie ante ut fringilla purus eros quis glavrid from dolor amet iquam lorem bibendum.
          </p> */}
          <div className="team-socials">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>

        <div className="team-member">
          <img src={jayeshpatel} alt="Jayesh Patel" className="team-image" />
          <h3 className={`team-name ${isDarkMode ? 'dark' : ''}`}>Jayesh Patel</h3>
          {/* <p className="team-role">programming guru</p> */}
          {/* <p className="team-description">
            Glavi amet ritnisl libero molestie ante ut fringilla purus eros quis glavrid from dolor amet iquam lorem bibendum.
          </p> */}
          <div className="team-socials">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>
      </div>
    </section>
      <BottomNavigationComponent />
    </div>
        </>
    )
}
export default AboutUs