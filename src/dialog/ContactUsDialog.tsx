import { Close } from '@mui/icons-material';
import { Dialog } from '@mui/material';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const ContactUsDialog = (props: any) => {
    const { open, onClose } = props;
    return (
        <Dialog
            onClose={onClose}
            sx={{ m: '0px' }}
            open={open}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                className: "m-8 w-100"
            }}
        >
            <div className="primary-bold">
                <div className='d-flex align-items-center justify-content-between px-24 bg-lightPrimary sticky-header'>
                    <h3 className='mt-10 mb-10'><b>Contact US</b></h3>
                    <Close sx={{ color: "#252525" }} onClick={() => onClose()} className='cursor-pointer' />
                </div>
                <div className='px-24 contact-us-bg'>
                    <div className='d-flex align-items-center'>
                        <h4 >Business name: &nbsp;</h4>
                        <p className='mb-2'>TechAvidus Private Limited</p>
                    </div>
                    <p className='mt-0 mb-2'>
                        <LocationOnIcon className="font-16 text-grey-200 mr-5" />  407, Capitol Icon, Sargasan, Gandhinagar
                    </p>
                    <p className='mt-2 mb-2 d-flex align-items-center'>
                        <LocalPhoneIcon className="font-16 text-grey-200 mr-5" /> +91 8160845612
                    </p>
                </div>
            </div>
        </Dialog>
    )
}

export default ContactUsDialog;