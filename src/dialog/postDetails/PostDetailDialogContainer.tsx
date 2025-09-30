import {
    Dialog
} from "@mui/material";
import LoginDialog from '../LoginDialog';
import PutAdDialog from './PutAdDialog';
import { UnfoldingAnimation } from "../../utils/UnfoldingAnimation";
import { AnimatePresence, motion } from "framer-motion";
import SmoothPopup from "../animations/FancyAnimatedDialog";

interface PostDetailsProps {
    open: boolean;
    activeStep?: number;
    handleClose: (data?: any, reason?: any) => void;
    setActiveStep?: (data?: number) => void;
    handleOk?: (data?: any) => void;
    isEdit?: boolean;
    isRepost?: any;
    isEditPost?: any
    editPostData?: any
}
const PostDetailsDialog = (props: PostDetailsProps) => {
    const { open, handleClose, activeStep, setActiveStep, handleOk, isEdit, isRepost, isEditPost, editPostData } = props

    return (
        <>
            {activeStep === 0 && (
                <LoginDialog
                    open={open}
                    handleClose={handleClose}
                    handleOk={handleOk}
                />
            )}
            {activeStep === 1 && (
                <div className='putAdDialogContainer' id="six">
                    <SmoothPopup
                        open={open}
                        onClose={handleClose}
                        maxWidth="xs"
                        fullWidth
                        className="putaddialog"
                        disableEscapeKeyDown={true}
                        // borderColor="#3f51b5"
                        backgroundColor="#242424"
                    // borderWidth={3}
                    // borderAnimationDuration={0.2}
                    // contentDelay={1.7}
                    >
                        <PutAdDialog
                            isRepost={isRepost}
                            handleOk={handleOk}
                            open={open}
                            handleClose={handleClose}
                            isEditPost={isEditPost}
                            editPostData={editPostData}
                        />
                    </SmoothPopup>
                </div>
            )}
            {/* {activeStep === 2 && (
                <Dialog
                    onClose={handleClose}
                    sx={{ m: '0px' }}
                    open={open}
                    maxWidth="xs"
                    fullWidth
                >
                    <AddFundComponent />
                </Dialog>
            )} */}
        </>
    )
}

export default PostDetailsDialog
