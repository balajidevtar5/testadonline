import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent, DialogContentText, DialogTitle
} from "@mui/material";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { LayoutContext } from "../../components/layout/LayoutContext";
import { colorMap } from "../../libs/constant";
import BounncePopup from "../animations/bouncepopup";
import { TextAreaField } from "../../components/formField/FormFieldComponent";
import { useForm } from "react-hook-form";
import { Padding } from "@mui/icons-material";
interface PostDetailsProps {
    open: boolean;
    handleOk?: (data?: any) => void,
    handleClose: (data?: any) => void;
    isEdit?: boolean;
    editPostData?: any;
    deleteMessage?: any;
    handleReportClick: (data?: any) => void;
    isLoading?: boolean;
    reportUser?: boolean;
}
const ReportPost = (props: PostDetailsProps) => {
    const { open, handleClose, deleteMessage, handleReportClick, isLoading, reportUser = false } = props
    const { register, formState, handleSubmit, watch, control, setValue } = useForm();
    const watchField: any = watch();
    const { isDarkMode } = useContext(LayoutContext);
    const { t } = useTranslation()
    return (
        <>
            <BounncePopup width="100%" open={open}
                onClose={handleClose}
            >
                <DialogTitle style={{ cursor: 'move', color: isDarkMode ? colorMap.white : colorMap.darkgray }} id="draggable-dialog-title">
                    {reportUser ? t("General.Report User") : t("General.Report Ad")}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText >
                        <TextAreaField
                            {...{
                                register,
                                formState,
                                control,
                                name: "note",
                                id: "note",
                                type: "textarea",
                                placeholder: reportUser ? t("General.Please tell us why you're reporting this user...") : t("General.Please tell us why you're reporting this ad...") + "*",
                                autoComplete: "true",
                                multiline: true,
                                className: `p-0 PostDetailStyles_textArea__D8DKj MuiOutlinedInput-input note`,
                                draggable: false,
                                style: {
                                    Padding: "5px",
                                    backgroundColor: isDarkMode ? "#242424" : "#fff", color: isDarkMode
                                        && "#fff",
                                    width: "100%",

                                }, // ✅ Fixed style
                                onKeyDown: (e) => {
                                    if (e?.target?.value?.trim() === "" && e?.keyCode === 13) {
                                        e.preventDefault();
                                    }
                                },
                                onInput: (e) => {
                                    const maxLength = 600;
                                    const inputValue = e.target.value;

                                    if (inputValue.length > maxLength) {
                                        e.target.value = inputValue.slice(0, maxLength);
                                        setValue("note", e.target.value);
                                    } else {
                                        setValue("note", inputValue);
                                    }
                                },
                            }}
                        />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button style={{ background: "red", color: "#fff", padding: "5px 8px", cursor: "ponter" }} autoFocus onClick={handleClose}>
                        {t("General.Cancel")}
                    </Button>
                    <Button style={{ background: "green", color: "#fff", padding: "5px 8px", cursor: "ponter" }} onClick={() => handleReportClick(watchField?.note)}>{isLoading ? <CircularProgress size={20} color="inherit" /> : reportUser ? t("General.Report User") : t("General.Report Ad")}</Button>
                </DialogActions>
            </BounncePopup>
        </>
    )
}

export default ReportPost
