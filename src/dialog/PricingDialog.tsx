import { Close } from '@mui/icons-material';
import { Dialog } from '@mui/material';

const PricingDialog = (props: any) => {
    const { open, onClose } = props;
    return (
        <Dialog
            onClose={onClose}
            open={open}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                className: "m-8 w-100"
            }}
        >
            <div className="primary-bold">
                <div className='d-flex align-items-center justify-content-between px-24 bg-lightPrimary sticky-header'>
                    <h3 className='mt-10 mb-10'><b>Pricing</b></h3>
                    <Close sx={{ color: "#252525" }} onClick={() => onClose()} className='cursor-pointer' />
                </div>
                <div className='px-24'>
                    <h4 className='mb-0 mt-10'>Welcome to AdOnline.in! </h4>
                    <p>We offer very cheap and flexible pricing plans to meet your needs.
                        TechAvidus Private Limited has build this application so when you do add fund, payment will be transferred in account
                        of TechAvidus Private Limited. When you add any advertisement (ad), it will cut amount from your balance amount
                        based on below pricing.</p>
                    <h4 className='mb-0'><b>1. Free Ads</b></h4>
                    <p className='mt-10'>
                        We offer weekly one free ad.
                    </p>
                    <h4 className='mb-0'><b>2. Paid Ads</b></h4>
                    <p className='mt-10'>
                        After free ads, rates will keep increasing 10rs for each ad. For example, second ad of week will cost you 10rs.
                        Third ad of week will cost you 20rs and so on.
                    </p>
                    <h4 className='mb-0'><b>3. Highlight Ads</b></h4>
                    <p className='mt-10'>
                        20rs per ad.
                    </p>
                    <h4 className='mb-0'><b>Contact Us</b></h4>
                    <p className='mt-10'>
                        If you have any questions, please contact us on helpline number +91 81608 45612
                    </p>
                </div>
            </div>
        </Dialog >
    )
}

export default PricingDialog;