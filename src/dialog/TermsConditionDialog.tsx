import { Close } from '@mui/icons-material';
import { Dialog } from '@mui/material';

const TermsConditionDialog = (props: any) => {
    const { open, onClose } = props;
    return (
        <Dialog
            onClose={onClose}
            open={open}
            maxWidth="lg"
            fullWidth
            PaperProps={{
             className:"m-8 w-100"   
            }}
        >
            <div className="primary-bold">
                <div className='d-flex align-items-center justify-content-between px-24 bg-lightPrimary sticky-header'>
                    <h3 className='mt-10 mb-10'><b>Terms and Conditions</b></h3>
                    <Close sx={{ color: "#252525" }} onClick={() => onClose()} className='cursor-pointer' />
                </div>
                <div className='px-24'>
                    <h4 className='mb-0 mt-10'>Welcome to AdOnline.in! By accessing and using our website, you agree to comply with the following terms and 
                        conditions. Please read them carefully.</h4>
                    <h4 className='mb-0'><b>1. Acceptance of Terms</b></h4>
                    <p className='mt-10'>
                        By using our website, you acknowledge that you have read, understood, and accepted these terms and conditions.
                        If you do not agree with any part of these terms, please refrain from using our services.
                    </p>
                    <h4 className='mb-0'><b>2. User Conduct</b></h4>
                    <p className='mt-10'>
                        <ul className='pl-20 list-style-square'>
                            <li className='mb-10'>You agree not to engage in any prohibited activities, including but not limited to:
                            </li>
                            <li className='mb-10'>Violating any applicable laws or regulations.</li>
                            <li className='mb-10'>Posting false, misleading, or harmful content.</li>
                            <li className='mb-10'>Impersonating others or misrepresenting your identity.</li>
                            <li className='mb-10'>Interfering with the functionality of the website.</li>
                            <li className='mb-10'>We reserve the right to terminate your account if you violate these terms.</li>
                        </ul>
                    </p>
                    <h4 className='mb-0'><b>3. Intellectual Property</b></h4>
                    <p className='mt-10'>
                        All content on AdOnline.in, including text, images, logos, and trademarks, is protected by intellectual property laws.
                        You may not use, reproduce, or distribute our content without our explicit permission.
                    </p>
                    <h4 className='mb-0'><b>4. Limitation of Liability</b></h4>
                    <p className='mt-10'>
                        We strive to provide accurate information, but we do not guarantee the completeness, reliability, or timeliness of the content.
                        We are not liable for any direct, indirect, incidental, or consequential damages arising from your use of our website.
                    </p>
                    <h4 className='mb-0'><b>5. Dispute Resolution</b></h4>
                    <p className='mt-10'>Any disputes arising from your use of AdOnline.in shall be resolved through negotiation or mediation.
                        If resolution is not possible, you agree to submit to the exclusive jurisdiction of the courts in Gandhinagar.</p>
                    <h4 className='mb-0'><b>6. Changes to Terms</b></h4>
                    <p className='mt-10'>
                        We may update these terms periodically. Any changes will be posted on our website.
                        Continued use of our services after such changes constitutes acceptance of the modified terms.
                    </p>
                    <h4 className='mb-0'><b>7. Contact Us</b></h4>
                    <p className='mt-10'>
                        If you have any questions or concerns regarding these terms, please contact us on helpline number +91 81608 45612.
                    </p>
                </div>
            </div>
        </Dialog>
    )
}

export default TermsConditionDialog;