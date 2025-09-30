import { Close } from '@mui/icons-material';
import { Dialog } from '@mui/material';

const AboutUsDialog = (props: any) => {
    const { open, onClose } = props;
    return (
        <Dialog
            onClose={onClose}
            sx={{ m: '0px' }}
            open={open}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                className: "m-8 w-100"
            }}
        >
            <div className="primary-bold">
                <div className='d-flex align-items-center justify-content-between px-24 bg-lightPrimary sticky-header'>
                    <h3 className='mt-10 mb-10'><b>About us</b></h3>
                    <Close sx={{ color: "#252525" }} onClick={() => onClose()} className='cursor-pointer' />
                </div>
                <div className='px-24'>
                    <h4 className='mb-0'><b>1. Our Story</b></h4>
                    <p className='mt-10'>
                        At <strong>AdOnline.in</strong>, our journey began with a simple idea: to create a platform that connects people,
                        businesses, and opportunities. We envisioned a space where classified ads could thrive,
                        where buyers and sellers could find each other effortlessly, and where communities could come together.
                    </p>
                    <h4 className='mb-0'><b>2. What We Offer</b></h4>
                    <p className='mt-10 mb-0'>
                        Our mission is to empower individuals and businesses by providing a seamless and efficient classified experience.
                        Whether you’re looking to buy, sell, or explore, <strong>AdOnline.in</strong> is your go-to destination.
                        From real estate and jobs to services and events, we’ve got you covered.
                    </p>
                    <p className='mt-10'>
                        <strong>AdOnline.in</strong> has been created with a simple yet highly effective purpose: to connect people in need. Our
                        commitment is to make this platform user-friendly for everyone. Not only do we market on our website,
                        but we also extend our reach to platforms like Facebook, Instagram, WhatsApp, and Telegram.
                    </p>
                    <h4 className='mb-0'><b>3. Why Choose Us?</b></h4>
                    <p className='mt-10'>
                        <ul className='pl-20 list-style-square'>
                            <li className='mb-10'>Transparency: We believe in openness and honesty. Our platform ensures transparency in every transaction.
                            </li>
                            <li className='mb-10'>User-Centric: You, our users, are at the heart of everything we do. We’re committed to enhancing your experience.</li>
                            <li className='mb-10'>Quality Listings:We curate high-quality listings to ensure you find what you’re looking for quickly and easily.</li>
                            <li className='mb-10'>Community: <strong>AdOnline.in</strong>  is more than a website; it’s a community. Join us in shaping the future of classifieds.</li>
                        </ul>
                    </p>
                    <h4 className='mb-0'><b>4. Meet Our Team</b></h4>
                    <p className='mt-10'>
                        Behind the scenes, a dedicated team works tirelessly to make <strong>AdOnline.in</strong> a reality.
                        We’re passionate about connecting people and creating value. Our dedicated team has put immense effort into creating
                        a sleek and elegant design. The success of this initiative rests on the minds of expert software programmers.
                    </p>
                    <h4 className='mb-0'><b>5. Get in Touch</b></h4>
                    <p className='mt-10 mb-0'>Have questions? Want to collaborate?</p>
                    <p className='mt-10'>
                        Reach out to us—we’d love to hear from you!
                        Feel free to customize this content to align with your brand’s unique voice and vision. If you need further assistance, don’t hesitate to ask.
                    </p>
                </div>
            </div>
        </Dialog>
    )
}

export default AboutUsDialog