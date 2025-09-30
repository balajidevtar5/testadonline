import { useState, useContext } from 'react';
import { Button } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Modal, Table } from 'antd';
import BottomNavigationComponent from '../../components/bottomNavigation/bottomNavigation';
import InputField, { SelectField } from '../../components/formField/FormFieldComponent';
import './UserDetailsStyles.module.scss';
import { LayoutContext } from '../../components/layout/LayoutContext';

interface UserDetailsProps {
    UserListColumn: any;
    updatedUserListData: any;
    isLoading: boolean;
    totalItems?: any;
    handleTableChange?: any;
    setSelectionType?: any;
    selectionType?: any;
    rowSelection?: any;
    showNotificationModal?: any;
    handleOk?: any;
    isNotificationModelOpen?: any;
    formState?: any;
    register?: any;
    control?: any;
    handleSubmit?: any;
    setIsNotificationModalOpen?: any;
    setIsWhatsAppModalOpen?: any;
    isWhatsappTemplateOpen?: any;
    onSubmit?: (d: any) => Promise<void>;
    handleWhatsappTemplate?: any;
    WhatsappTemplateList?: any;
    selectedRowKeys?: any;
    handleChangeWhatsappTemplate?: any;
    whatsappTemplateSubmit?: any;
    setValue: any;
}

const UserDetailsScene = (props: UserDetailsProps) => {
    const {
        UserListColumn,
        isLoading,
        updatedUserListData,
        totalItems,
        handleTableChange,
        rowSelection,
        selectedRowKeys,
        handleOk,
        isNotificationModelOpen,
        formState,
        register,
        control,
        setValue,
        handleSubmit,
        setIsNotificationModalOpen,
        onSubmit,
        setIsWhatsAppModalOpen,
        isWhatsappTemplateOpen,
        handleWhatsappTemplate,
        WhatsappTemplateList,
        handleChangeWhatsappTemplate,
        whatsappTemplateSubmit
    } = props;
    const { isDarkMode } = useContext(LayoutContext);
    const [selectedColor, setSelectedColor] = useState(isDarkMode ? "#242424" : "#fff");

    // uncomment this

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const handleDeleteImage = () => {
        setSelectedImage(null); // Clear the selected image
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];

            // Check file size (e.g., 10MB limit)
            const maxFileSize = 10 * 1024 * 1024; // 10MB in bytes
            if (file.size > maxFileSize) {
                alert("File size exceeds the maximum limit of 10MB.");
                return;
            }

            // Check file type (e.g., only images)
            const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
            if (!allowedTypes.includes(file.type)) {
                alert("Only JPEG, PNG, and GIF images are allowed.");
                return;
            }

            setSelectedImage(file);
        }
    };

    // State for selected WhatsApp template
    const [selectedTemplate, setSelectedTemplate] = useState("");
    const handleFormSubmit = async (data: any) => {
        const formData = new FormData();
        formData.append('messageTitle', data.messageTitle);
        formData.append('messageBody', data.messageBody);
        formData.append('url', data.url);
        if (selectedImage) {
            formData.append('image', selectedImage);
        }

        await onSubmit(formData);
        // fetch('YOUR_API_ENDPOINT', {
        //     method: 'POST',
        //     body: formData,
        // })
        //     .then(response => response.json())
        //     .then(result => {
        //         console.log('Success:', result);
        //         setIsNotificationModalOpen(false);
        //     })
        //     .catch(error => {
        //         console.error('Error:', error);
        //     });
    };

    // uncomment after this

    // // Handle WhatsApp template change
    // const handleTemplateChange = (event: any) => {
    //     setSelectedTemplate(event.target.value);
    //     if (handleChangeWhatsappTemplate) {
    //         handleChangeWhatsappTemplate(event.target.value);                      
    //     }
    // };

    // Handle WhatsApp template form submission
    const handleWhatsappSubmit = (event: any) => {
        event.preventDefault();
        if (whatsappTemplateSubmit) {
            whatsappTemplateSubmit(selectedTemplate);
        }
    };

    return (
        <>
            <div className="relative min-h-screen">
                <div className="pb-20" style={{ marginBottom: "100px" }}>
                    <div className="mt-60 d-flex flex-wrap gap justify-content-end p-10 pb-0 mb-60">
                        <div className="pushnotificationbtn">
                            <Button
                                disabled={selectedRowKeys.length === 0}
                                className={selectedRowKeys.length === 0 ? "btn-disable" : ""}
                                onClick={() => setIsNotificationModalOpen(true)}
                            >
                                Send SMS
                            </Button>
                        </div>
                        <div className="pushnotificationbtn">
                            <Button
                                disabled={selectedRowKeys.length === 0}
                                className={selectedRowKeys.length === 0 ? "btn-disable" : ""}
                                onClick={() => setIsNotificationModalOpen(true)}
                            >
                                Push Notification
                            </Button>
                        </div>
                        <div className="pushnotificationbtn">
                            <Button
                                disabled={selectedRowKeys.length === 0}
                                className={selectedRowKeys.length === 0 ? "btn-disable" : ""}
                                onClick={() => setIsNotificationModalOpen(true)}
                            >
                                Send Notification
                            </Button>
                        </div>
                        <div className="pushnotificationbtn">
                            <Button
                                disabled={selectedRowKeys.length === 0}
                                className={selectedRowKeys.length === 0 ? "btn-disable" : ""}
                                onClick={() => handleWhatsappTemplate()}
                            >
                                Send Whatsapp Template
                            </Button>
                        </div>
                    </div>

                    <div className="notificationModel">
                        <Modal style={{ backgroundColor: selectedColor }}
                            centered={true}
                            className="notificationModel"
                            title="Send Notification"
                            open={isNotificationModelOpen}
                            onOk={handleOk}
                            onCancel={() => {
                                setIsNotificationModalOpen(false);
                                setValue("messageTitle", "");
                                setValue("messageBody", "");
                                setValue("url", "");
                                setSelectedImage(null);
                            }}
                        >
                            <form id="advertiseDetailsForm" onSubmit={handleSubmit(handleFormSubmit)} style={{ backgroundColor: selectedColor, color: isDarkMode ? "#fff" : "#000" }}>
                                <div className="p-10">
                                    <InputField
                                        className='userDetailSendNotifTxt'
                                        style={{ color: isDarkMode ? "#fff" : "#000" }}
                                        {...{
                                            register,
                                            control,
                                            formState,
                                            id: "messageTitle",
                                            name: "messageTitle",
                                            autoFocus: true,
                                            type: "text",
                                            className: "hideNumberSpin",
                                            placeholder: "Enter your message title",
                                            label: "Message Title*",
                                        }}
                                    />
                                </div>
                                <div className="p-10">
                                    <InputField
                                        className='userDetailSendNotifTxt'
                                        style={{ color: isDarkMode ? "#fff" : "#000" }}
                                        {...{
                                            register,
                                            control,
                                            formState,
                                            id: "messageBody",
                                            name: "messageBody",
                                            autoFocus: true,
                                            type: "text",
                                            className: "hideNumberSpin",
                                            placeholder: "Enter your message body",
                                            label: "Message Body*",
                                        }}
                                    />
                                </div>
                                <div className="p-10">
                                    <InputField
                                        className='userDetailSendNotifTxt'
                                        style={{ color: isDarkMode ? "#fff" : "#000" }}
                                        {...{
                                            register,
                                            control,
                                            formState,
                                            id: "url",
                                            name: "url",
                                            autoFocus: true,
                                            type: "text",
                                            className: "hideNumberSpin",
                                            placeholder: "Enter Redirection Url",
                                            label: "Redirection url*",
                                        }}
                                    />
                                </div>

                                {/* remove this comments */}

                                <div className="p-10">
                                    <label className="form-label" style={{ color: "darkorange" }}>Upload Image*</label>
                                    <div className="custom-upload-wrapper">
                                        <label className="label">
                                            <div className="drag-file-area">
                                                <span className="browse-files">
                                                    <div className="upload-icon">
                                                        <img src="/upload_image.png" alt="Upload icon" style={{ maxWidth: "25%", borderRadius: "7px", cursor: "pointer", marginTop: "20px" }} />
                                                    </div>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        capture="environment"
                                                        name="Document"
                                                        id="contained-button-file"
                                                        title=""
                                                        onChange={(e: any) => handleImageUpload(e)}
                                                        multiple={false}
                                                        className="default-file-input"
                                                    />
                                                    <span className="browse-files-text">Browse file</span>
                                                    <span>from device</span>
                                                </span>
                                            </div>
                                        </label>

                                        {selectedImage && (
                                            <div className="image-preview-card">
                                                <div className="image-preview" style={{ position: "relative" }}>
                                                    <div style={{ position: "relative", display: "inline-block" }}>
                                                        <img
                                                            src={URL.createObjectURL(selectedImage)}
                                                            alt="Preview"
                                                            style={{ maxHeight: "30vh", overflowY: "auto", maxWidth: "30vh" }}
                                                        />
                                                        <DeleteOutlineIcon
                                                            className="delete-icon"
                                                            onClick={handleDeleteImage}
                                                            style={{
                                                                position: "absolute",
                                                                top: "5px",
                                                                right: "5px",
                                                                cursor: "pointer",
                                                                color: "red",
                                                                backgroundColor: "white",
                                                                borderRadius: "50%",
                                                                padding: "5px",
                                                                boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="d-flex cursor-pointer gap p-10 align-items-center justify-content-end footer-dialog">
                                    <Button
                                        type="reset"
                                        variant="outlined"
                                        color="error"
                                        className="close-btn"
                                        onClick={() => setIsNotificationModalOpen(false)}
                                    >
                                        Close
                                    </Button>
                                    <Button type="submit" form="advertiseDetailsForm" variant="contained" style={{ minWidth: "88px" }}>
                                        Send
                                    </Button>
                                </div>
                            </form>
                        </Modal>
                    </div>

                    {/* WhatsApp Template Modal */}
                    {/* <div className="whatsappTemplateModel">
                        <Modal
                            centered={true}
                            className="whatsappTemplateModel"
                            title="Send WhatsApp Template"
                            open={isWhatsappTemplateOpen}
                            onCancel={() => {
                                if (setIsWhatsAppModalOpen) {
                                    setIsWhatsAppModalOpen(false);
                                }
                                setSelectedTemplate("");
                            }}
                            footer={null}
                        >
                            <form id="whatsappTemplateForm" onSubmit={handleWhatsappSubmit}>
                                <div className="p-10">
                                    <SelectField
                                        {...{
                                            register,
                                            control,
                                            formState,
                                            id: "whatsappTemplate",
                                            name: "whatsappTemplate",
                                            autoFocus: true,
                                            className: "whatsappTemplateSelect",
                                            placeholder: "Select WhatsApp Template",
                                            label: "WhatsApp Template*",
                                            options: WhatsappTemplateList || [],
                                            value: selectedTemplate,
                                            // onChange: handleTemplateChange             remove this comment
                                        }}
                                    />
                                </div>
                                <div className="d-flex cursor-pointer gap p-10 align-items-center justify-content-end footer-dialog">
                                    <Button
                                        type="reset"
                                        variant="outlined"
                                        color="error"
                                        className="close-btn"
                                        onClick={() => {
                                            if (setIsWhatsAppModalOpen) {
                                                setIsWhatsAppModalOpen(false);
                                            }
                                            setSelectedTemplate("");
                                        }}
                                    >
                                        Close
                                    </Button>
                                    <Button 
                                        type="submit" 
                                        form="whatsappTemplateForm" 
                                        variant="contained" 
                                        style={{ minWidth: "88px" }}
                                        disabled={!selectedTemplate}
                                    >
                                        Send
                                    </Button>
                                </div>
                            </form>
                        </Modal>
                    </div> */}

                    <div style={{ marginBottom: "100px" }}>
                        <Table
                            rowKey="id"
                            columns={UserListColumn}
                            dataSource={updatedUserListData || []}
                            loading={isLoading}
                            pagination={{
                                total: totalItems,
                                position: ["bottomCenter"],
                                showSizeChanger: true,
                                pageSizeOptions: ["10", "20", "50", "100"],
                                defaultPageSize: 10,
                                className: "mb-16",
                            }}
                            rowSelection={{ ...rowSelection }}
                            onChange={handleTableChange}
                            className="overflow-y-hidden mt-10"
                        />
                    </div>
                </div>
                <div className="fixed bottom-0 left-0 right-0 z-50">
                    <BottomNavigationComponent />
                </div>
            </div>
        </>
    );
};

export default UserDetailsScene;