import { Close } from '@mui/icons-material';
import { Dialog } from '@mui/material';

const PrivacyPolicyDialog = (props: any) => {
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
                    <h3 className='mt-10 mb-10'><b>Privacy Policy</b></h3>
                    <Close sx={{ color: "#252525" }} onClick={() => onClose()} className='cursor-pointer' />
                </div>
                <div className='px-24'>
                    <h4 className='mb-0 mt-10'>Welcome to AdOnline.in! We value your privacy and are committed to protecting your personal information.
                        This privacy policy outlines how we collect, use, share, and safeguard your data. Please read it carefully.
                    </h4>
                    <h4 className='mb-0'><b>1. Information We Collect</b></h4>
                    <p className='mt-10'>
                        We collect various types of information, including:
                        Personal information (name and phone number) provided voluntarily by users.
                        Non-personal information (such as browser type, IP address, device information) collected automatically through cookies and other tracking technologies.
                    </p>
                    <h4 className='mb-0'><b>2. How We Use Your Information</b></h4>
                    <p className='mt-10'>
                        We use your information for the following purposes:
                        <ul className='pl-20 list-style-square'>
                            <li className='mb-10'>To improve our services and enhance user experience.</li>
                            <li className='mb-10'>To communicate with you regarding your inquiries, requests, or account-related matters.</li>
                            <li className='mb-10'>To personalize content and provide relevant recommendations.</li>
                            <li className='mb-10'>To comply with legal obligations.</li>
                        </ul>
                    </p>
                    <h4 className='mb-0'><b>3. Data Sharing and Disclosure</b></h4>
                    <p className='mt-10'>
                        <ul className='pl-20 list-style-square'>
                            <li className='mb-10'>Service providers who assist us in operating our website.
                            </li>
                            <li className='mb-10'>Legal authorities when required by law.</li>
                            <li className='mb-10'>Third parties with your consent.</li>
                        </ul>
                    </p>
                    <h4 className='mb-0'><b>4. Cookies and Tracking Technologies</b></h4>
                    <p className='mt-10'>
                        We use cookies and similar technologies to collect non-personal information. You can manage your cookie preferences through your browser settings.
                    </p>
                    <h4 className='mb-0'><b>5. Your Rights</b></h4>
                    <p className='mt-10'>Have questions? Want to collaborate?</p>
                    <ul className='pl-20 list-style-square'>
                        <li className='mb-10'>Access and update your personal information.
                        </li>
                        <li className='mb-10'>Opt out of marketing communications.</li>
                        <li className='mb-10'>Request deletion of your data.</li>
                    </ul>
                    <h4 className='mb-0'><b>6. Security Measures</b></h4>
                    <p className='mt-10'>We take reasonable steps to protect your data from unauthorized access, alteration, or disclosure.</p>
                    <h4 className='mb-0'><b>7. Changes to this Privacy Policy</b></h4>
                    <p className='mt-10'>We may update this policy periodically. Any changes will be posted on our website.</p>
                    <h4 className='mb-0'><b>8. Contact Us</b></h4>
                    <p className='mt-10'>If you have any questions or concerns about our privacy practices, please contact us at helpline number +91 8160845612.</p>
                    <p>Remember to replace the placeholders (such as email address and website name) with your actual details.
                        If you need further assistance, feel free to ask! </p>
                </div>
            </div>
        </Dialog>
    )
}

export default PrivacyPolicyDialog;