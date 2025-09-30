import { useState , useContext, useEffect } from 'react';
import { Button } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Modal, Table } from 'antd';
import BottomNavigationComponent from '../../components/bottomNavigation/bottomNavigation';
import InputField, { SelectField } from '../../components/formField/FormFieldComponent';
import { LayoutContext } from '../../components/layout/LayoutContext';
import { AddUpdateUrl } from '../../redux/services/ShortenUrl';
import DeletePost from '../../dialog/postDetails/deatepostpopup';
import { useTranslation } from 'react-i18next';

interface ShortenURLProps {
    ShortenColumn: any;
    updatedShortenURLData: any;
    isLoading: boolean;
    totalItems?: any;
    handleTableChange?: any;
    setSelectionType?: any;
    selectionType?: any;
    showNotificationModal?: any;
    handleOk?: any;
    isShortenURLModelOpen?: any;
    formState?: {
        errors: any;
    };
    register?: any;
    control?: any;
    handleSubmit?: any;
    setIsAddShortenURLModalOpen?: any;
    setIsWhatsAppModalOpen?: any;
    isWhatsappTemplateOpen?: any;
    handleWhatsappTemplate?: any;
    WhatsappTemplateList?: any;
    handleChangeWhatsappTemplate?: any;
    whatsappTemplateSubmit?: any;
    setValue: any;
    shortenURLData:any,
    editPostData:any,
    handleFormSubmit:any,
    setIsDeleteDialog:any,
    isDeletePopup:any,
    deleteAd:any,
    handleAddClick:any
}

const ShortenURLSeen = (props: ShortenURLProps) => {
    const {
        ShortenColumn,
        isLoading,
        totalItems,
        handleTableChange,
        handleOk,
        isShortenURLModelOpen,
        formState,
        register,
        control,
        setValue,
        handleSubmit,
        setIsAddShortenURLModalOpen,
        whatsappTemplateSubmit,
        shortenURLData,
        editPostData,
        handleFormSubmit,
        setIsDeleteDialog,
        isDeletePopup,
        deleteAd,
        handleAddClick
    } = props;
    const  { isDarkMode } = useContext(LayoutContext);
    const [selectedColor, setSelectedColor] = useState(isDarkMode ? "#242424" :"#fff");
    const {t} = useTranslation()
   

  
    useEffect(()=>{
        if(editPostData){
            setValue("name",editPostData.name)
            setValue("ToURL",editPostData.tourl)
            setValue("FromURL",editPostData.fromurl)
        }
    },[editPostData])



    return (
        <>
            <div className="relative min-h-screen">
                <div className="pb-20" style={{ marginBottom: "100px" }}>
                    <div className="mt-60 d-flex flex-wrap gap justify-content-end p-10 pb-0 mb-60">
                        <div className="pushnotificationbtn">
                            <Button
                                onClick={handleAddClick}
                            >
                                Add Shorten Url
                            </Button>
                        </div>
                      
                    </div>

                    <div className="notificationModel">
                        <Modal style={{ backgroundColor: selectedColor}}
                            centered={true}
                            className="notificationModel"
                            title="Add Shorten Url"
                            open={isShortenURLModelOpen}
                            onOk={handleOk}
                            onCancel={() => {
                                setIsAddShortenURLModalOpen(false);
                                setValue("messageTitle", "");
                                setValue("messageBody", "");
                                // setSelectedImage(null);
                            }}
                        >
                            <form  id="advertiseDetailsForm" onSubmit={handleSubmit(handleFormSubmit)} style={{backgroundColor: selectedColor,color: isDarkMode ? "#fff" : "#000"}}>
                                <div className="p-10"style={{ backgroundColor: isDarkMode ? "#242424" : "#fff" }}>
                                    <InputField
                                     className='userDetailSendNotifTxt'
                                     style={{ color: isDarkMode ? "#fff" : "#000" , backgroundColor: isDarkMode ? "#242424" : "#fff"}}
                                        {...{
                                            register,
                                            control,
                                            formState,
                                            id: "name",
                                            name: "name",
                                            autoFocus: true,
                                            type: "text",
                                            className: "hideNumberSpin",
                                            placeholder: "Enter name",
                                            label: "Name*",
                                            error: formState.errors.name?.message
                                        }}
                                    />
                                </div>
                                <div className="p-10" style={{ backgroundColor: isDarkMode ? "#242424" : "#fff" }}>
                                    <InputField
                                     className='userDetailSendNotifTxt'
                                     style={{color: isDarkMode ? "#fff" : "#000" , backgroundColor: isDarkMode ? "#242424" : "#fff"}}
                                        {...{
                                            register,
                                            control,
                                            formState,
                                            id: "FromURL",
                                            name: "FromURL",
                                            autoFocus: true,
                                            type: "text",
                                            className: "hideNumberSpin",
                                            placeholder: "Enter From URL",
                                            label: "FromURL*",
                                            error: formState.errors.FromURL?.message
                                        }}
                                    />
                                </div>
                                
                                {/* remove this comments */}
                                
                                <div className="p-10" style={{ backgroundColor: isDarkMode ? "#242424" : "#fff" }}>
                                    <InputField
                                     className='userDetailSendNotifTxt'
                                     style={{color: isDarkMode ? "#fff" : "#000" , backgroundColor: isDarkMode ? "#242424" : "#fff"}}
                                        {...{
                                            register,
                                            control,
                                            formState,
                                            id: "ToURL",
                                            name: "ToURL",
                                            autoFocus: true,
                                            type: "text",
                                            className: "hideNumberSpin",
                                            placeholder: "Enter To URL",
                                            label: "ToURL*",
                                            error: formState.errors.ToURL?.message
                                        }}
                                    />
                                </div>
                                <div className="d-flex cursor-pointer gap p-10 align-items-center justify-content-end footer-dialog">
                                    <Button
                                        type="reset"
                                        variant="outlined"
                                        color="error"
                                        className="close-btn"
                                        onClick={() => setIsAddShortenURLModalOpen(false)}
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
                            columns={ShortenColumn}
                            dataSource={shortenURLData || []}
                            loading={isLoading}
                            pagination={{
                                total: totalItems,
                                position: ["bottomCenter"],
                                showSizeChanger: true,
                                pageSizeOptions: ["10", "20", "50", "100"],
                                defaultPageSize: 10,
                                className: "mb-16",
                            }}
                            onChange={handleTableChange}
                            className="overflow-y-hidden mt-10"
                        />
                    </div>
                </div>
                <div className="fixed bottom-0 left-0 right-0 z-50">
                    <BottomNavigationComponent />
                </div>

                <DeletePost
                        handleOk={(response) => {
                         
                        }}
                        deleteMessage={t(
                          `General.Are you sure you want to delete this link?`
                        )}
                        editPostData={editPostData}
                        open={isDeletePopup}
                        handleClose={() => setIsDeleteDialog(false)}
                        handleDeleteClick={() => deleteAd(editPostData)}
                      />
            </div>
        </>
    );
};

export default ShortenURLSeen;