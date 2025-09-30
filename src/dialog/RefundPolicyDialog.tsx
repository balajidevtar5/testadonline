import { Close } from '@mui/icons-material';
import { Dialog } from '@mui/material';

const RefundPolicyDialog = (props: any) => {
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
                    <h3 className='mt-10 mb-10'><b>Refund Policy</b></h3>
                    <Close sx={{ color: "#252525" }} onClick={() => onClose()} className='cursor-pointer' />
                </div>
                <div className='px-24'>
                    <h4 className='mt-10'>Welcome to AdOnline.in! By using our services, you agree to comply with the following refund policy.
                        Please read it carefully.</h4>
                    <h4 className='mb-0'><b>1. Refunding Rules</b></h4>
                    <p className='mt-10'>
                        <strong>AdOnline.in</strong>, does not offer refunds for services we offer.
                        All sales are final, and once a subscription is made, it cannot be reversed.
                    </p>
                    <h4 className='mb-0'><b>2. Amount Deducted but does not reflect on <strong>AdOnline.in</strong></b></h4>
                    <p className='mt-10'>
                        <ul className='pl-20 list-style-square'>
                            <li className='mb-10'>In case your payment is not reflected on AdOnline.in, but the amount has been deducted from your account, please
                                Contact our helpline immediately on +91 81608 45612.
                            </li>
                            <li className='mb-10'>Provide relevant details such as order number and transaction ID.</li>
                            <li className='mb-10'>We will investigate and resolve the issue promptly.</li>
                        </ul>
                    </p>
                    <h4 className='mb-0'><b>3. Changes to this Policy</b></h4>
                    <p className='mt-10'>We reserve the right to modify the terms of this refund policy at any time without notice.</p>
                    <h4 className='mb-0'><b>4. Contact Us</b></h4>
                    <p className='mt-10'>If you have any questions or concerns regarding refund policy, please contact us on helpline number +91 8160845612.</p>
                </div>
            </div>
        </Dialog>
    )
}

export default RefundPolicyDialog;