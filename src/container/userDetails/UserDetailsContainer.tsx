import React, { useEffect, useRef, useState, useContext } from 'react'
import UserDetailsScene from './UserDetailsScene'
import { TableColumnsProps } from '../../libs/types';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserList } from '../../redux/slices/users';
import { RootState } from '../../redux/reducer';
import { changeDateFormat } from '../../libs/helper';
import { Button, DatePicker, Input, message, Space } from 'antd';
import { ElevenMp, SearchOutlined } from '@mui/icons-material';
import UserDetailStyles from "./UserDetailsStyles.module.scss";
import { useForm } from 'react-hook-form';
import { pushNotificationApi } from '../../redux/services/user.api';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { GetWhatsappTemplates, SendWhatsappMessage } from '../../redux/services/common.api';
import { LayoutContext } from '../../components/layout/LayoutContext';
// Extend dayjs with the isBetween plugin
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
interface DataType {
    key: React.Key;
    dataIndex: string;
    age: number;
    address: string;
}

const UserDetailsContainer = () => {
    const dispatch: any = useDispatch();
    const [searchArray, setSearchArray] = useState([]);
    const initialState = {
        Search: "",
        PageSize: 10,
        PageNumber: 1,
        SortColumn: "lastlogin",
        SortDirection: "desc",
    }
    const [userDetailPayload, setUserDetailPayload] = useState(initialState)
    const searchInput = useRef(null);
    const { data: userListData, isLoading } = useSelector((state: RootState) => state.userList);
    const { data: loginUserData } = useSelector((state: RootState) => state.loginUser);
    const [totalItems, setTotalItems] = useState(null)
    const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>('checkbox');
    const [selectedRows, setSelectedRows] = useState([])
    const [updatedUserListData, setUpdatedUserListData] = useState([])
    const [isSelectAll, setIsSelectAll] = useState(false)
    const [isNotificationModelOpen, setIsNotificationModalOpen] = useState(false)
    const [isWhatsappTemplateOpen, setIsWhatsAppModalOpen] = useState(false)
    const [WhatsappTemplateList, setWhatsappTemplateList] = useState([])


    const { register, formState, control, handleSubmit, setValue, reset } = useForm();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [isSelectAllChange, setIsSelectAllChange] = useState(false);

    const [deselectedRowKeys, setDeselectedRowKeys] = useState([]);
    const [selectedTemplate, setSlectedTemplate] = useState(null);



    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchArray(prevSearchArray => {
            const updatedSearchArray = [...prevSearchArray, { key: dataIndex, value: selectedKeys[0] }];

            const dataIndexToPayloadKey = {
                username: 'UsernameSearch',
                location: 'LocationSearch',
                mobileno: 'PhoneSearch'
            };

            const updatedPayload = { ...userDetailPayload };
            if (dataIndex === "lastlogin") {
                const [from, to] = selectedKeys[0];
                updatedPayload["FromDate"] = from;
                updatedPayload["ToDate"] = to;
            }
            updatedSearchArray.forEach(entry => {
                const payloadKey = dataIndexToPayloadKey[entry.key];
                if (payloadKey) {
                    updatedPayload[payloadKey] = entry.value;
                }
            });
            setUserDetailPayload(updatedPayload);
            return updatedSearchArray;
        });
    };


    const handleReset = (setSelectedKeys, clearFilters: (confirm) => void, dataIndex: string) => {
        // Call the clearFilters function to reset the filter
        clearFilters({ confirm: true });
        // Filter the searchArray to remove the entry based on dataIndex
        const updatedSearchArray = searchArray.filter(item => item?.key !== dataIndex);
        // Update the search array state
        setSearchArray(updatedSearchArray);
        // Define the mapping of dataIndex to payload keys
        const dataIndexToPayloadKey = {
            username: 'UsernameSearch',
            location: 'LocationSearch',
            mobileno: 'PhoneSearch'
        };
        // Get the payload key for the given dataIndex
        const payloadKeyToRemove = dataIndexToPayloadKey[dataIndex];
        if (payloadKeyToRemove) {
            // If the payload key exists, create a copy of userDetailPayload and remove the relevant key
            const updatedPayload = { ...userDetailPayload };
            delete updatedPayload[payloadKeyToRemove];
            // Set the updated payload state
            setUserDetailPayload(updatedPayload);
        }
        // Additional reset logic if needed for 'lastlogin' or other custom logic
        if (dataIndex === "lastlogin") {
            const updatedPayload = { ...userDetailPayload };
            delete updatedPayload["FromDate"];
            delete updatedPayload["ToDate"];
            setUserDetailPayload(updatedPayload);
        }
    };


    const handleChangeWhatsappTemplate = (value) => {
        setSlectedTemplate(value)

    }


    const  { isDarkMode } = useContext(LayoutContext);
    const getColumnSearchProps = (dataIndex, isDateRange = false) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div
                style={{
                    padding: 8,
                    zIndex: 1000,
                }}
                onKeyDown={(e) => e.stopPropagation()}
                className="antclass"
            >
                {isDateRange ? (
                    <DatePicker.RangePicker
                        value={
                            // Check if selectedKeys[0] has two dates, then convert them to Dayjs objects
                            selectedKeys[0] && Array.isArray(selectedKeys[0]) && selectedKeys[0].length === 2
                                ? [
                                    dayjs(selectedKeys[0][0]), // Convert the first date to Dayjs
                                    dayjs(selectedKeys[0][1]), // Convert the second date to Dayjs
                                ]
                                : [null, null] // If no dates selected, pass null to indicate no selection
                        }
                        onChange={(dates, dateStrings) => {
                            const [startDate, endDate] = dateStrings;

                            // If both dates are valid, set selectedKeys with the range
                            if (startDate && endDate) {
                                setSelectedKeys([[startDate, endDate]]);
                            } else {
                                setSelectedKeys([]); // Clear the selected keys if no valid dates
                            }
                        }}
                        className="mobile-date-picker"
                        style={{ marginBottom: 8, display: 'block' }}
                        getPopupContainer={(trigger) => trigger.parentElement}
                        placement="bottomLeft"
                        popupStyle={{ position: 'fixed' }}
                    />
                ) : (
                    <Input
                        ref={searchInput}
                        placeholder={`Search ${dataIndex}`}
                        value={selectedKeys[0]}
                        onChange={(e) =>
                            setSelectedKeys(e.target.value ? [e.target.value] : [])
                        }
                        onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        style={{
                            marginBottom: 8,
                            display: "block",
                        }}
                    />
                )}
                <Space>
                    <Button
                        type="primary"
                        disabled={
                            isDateRange
                                ? !(selectedKeys[0] && selectedKeys[0].length === 2) // Disable if date range is incomplete
                                : !selectedKeys[0] // Disable if text filter input is empty
                        }
                        className={`btn-primary d-flex align-items-center ${UserDetailStyles.searchFilter}`}
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={
                            <SearchOutlined
                                sx={{
                                    color: "#63636370",
                                    width: "18px",
                                    height: "18px",
                                    mr: "3px",
                                }}
                            />
                        }
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => {
                            clearFilters && handleReset(setSelectedKeys, clearFilters, dataIndex);
                            // Reset the selected date range as well
                            setSelectedKeys([]); // Reset selected keys on clear
                        }}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                sx={{
                    color: filtered ? "#1890ff" : isDarkMode ? "#fff" : "#63636370", 
                    width: "18px",
                    height: "18px",
                    mr: "3px",
                }}
            />
        ),
        onFilter: (value, record) => {
            if (isDateRange && Array.isArray(value) && value.length === 2) {
                const [startDate, endDate] = value.map((v) => dayjs(v));
                const recordDate = dayjs(record[dataIndex]);

                // Use inclusive range check with end of day for the end date
                return (
                    recordDate.isSameOrAfter(startDate.startOf("day")) &&
                    recordDate.isSameOrBefore(endDate.endOf("day"))
                );
            }

            return (
                record[dataIndex] !== null &&
                record[dataIndex]?.trim().toLowerCase()?.includes(value?.trim().toLowerCase())
            );
},
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) => text,
    });

    const UserListColumn: TableColumnsProps[] = [

        {
            title: "User Name",
            dataIndex: "username",
            key: 1,
            sorter: true,
            ...getColumnSearchProps("username"),
        },
        {
            title: "Location",
            dataIndex: "location",
            key: 2,
            ...getColumnSearchProps("location"),
            sorter: true,
        },
        {
            title: "Phone Number",
            dataIndex: "mobileno",
            key: 3,
            ...getColumnSearchProps("mobileno"),
            sorter: true,
        },
        {
            title: "Last Login At",
            dataIndex: "lastlogin",
            key: 4,
            sorter: true,
            ...getColumnSearchProps("lastlogin", true),
            render: (lastlogin) => {
                return changeDateFormat(lastlogin);
            }
        },
    ];


    const handleTableChange = (e, filters, sorter, extra) => {
        setUserDetailPayload({ ...userDetailPayload, PageSize: e.pageSize, PageNumber: e.current })
        if (sorter.order === undefined) {
            setUserDetailPayload({ ...userDetailPayload, PageSize: e.pageSize, PageNumber: e.current, SortColumn: "lastlogin", SortDirection: "desc" })
        } else {
            if (Object.keys(sorter).length > 0) {
                setUserDetailPayload({ ...userDetailPayload, PageSize: e.pageSize, PageNumber: e.current, SortColumn: sorter.field, SortDirection: sorter.order == "descend" ? "desc" : "asc" })
            }
        }

    }


    const whatsappTemplateSubmit = async () => {
        const payload = {
            "templateId": selectedTemplate?.id,
            "templateName": selectedTemplate?.name,
            "userIds": isSelectAll ? deselectedRowKeys : selectedRowKeys,
            "isSelectAll": isSelectAll
        }

        const keyMapping = {
            "username": "UsernameSearch",
            "location": "LocationSearch",
            "mobileno": "PhoneSearch",
            "lastlogin": ["FromDate", "ToDate"] // Since lastlogin is an array
        };

       
        
        if(isSelectAll){
            searchArray.forEach(item => {
                if (item.key === "lastlogin" && Array.isArray(item.value)) {
                    // Assigning FromDate and ToDate separately
                    payload[keyMapping.lastlogin[0]] = item.value[0]; // FromDate
                    payload[keyMapping.lastlogin[1]] = item.value[1]; // ToDate
                } else if (keyMapping[item.key]) {
                    payload[keyMapping[item.key]] = item.value;
                }
            });
        }
        const response = await SendWhatsappMessage(payload)

        if (response?.success) {
            message.success(response.message);
            setIsWhatsAppModalOpen(false);
        }
    }

   const onSubmit = async (formData: FormData) => {
    try {
        const title = formData.get('messageTitle') as string; 
        const desc = formData.get('messageBody') as string;
        const url = formData.get('url') as string;   
        const image = formData.get('image');                   
        let imageHash = null;

        if (image instanceof File) {
            imageHash = {
                name: image.name,
                size: image.size,
                type: image.type,
                lastModified: image.lastModified,
            };
        }

        const payload = {
            "userIds": isSelectAll ? deselectedRowKeys : selectedRowKeys,
            "title": title,
            "desc": desc,
            "url":url,
            "isSelectAll": isSelectAll
        };

        const keyMapping = {
            "username": "UsernameSearch",
            "location": "LocationSearch",
            "mobileno": "PhoneSearch",
            "lastlogin": ["FromDate", "ToDate"]
        };

        if (isSelectAll) {
            searchArray.forEach(item => {
                if (item.key === "lastlogin" && Array.isArray(item.value)) {
                    payload[keyMapping.lastlogin[0]] = item.value[0]; 
                    payload[keyMapping.lastlogin[1]] = item.value[1]; 
                } else if (keyMapping[item.key]) {
                    payload[keyMapping[item.key]] = item.value;
                }
            });
        }
        const formPayload = new FormData();
        formPayload.append("model", JSON.stringify(payload)); // API expects a string, not an object
        if (image instanceof File) {
            formPayload.append("image", image); // Sending the actual image file
        }


        const response = await pushNotificationApi(formPayload);

        if (response.success) {
            message.success(response.message);
            reset({
                messageTitle: "", 
                messageBody: "",  
                url:"",
                image: "",
            });
            setIsNotificationModalOpen(false);
        }

    } catch (error) {
    }
};
    // rowSelection object indicates the need for row selection
    // const handleRowSelectionChange = {
    //     onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
    //         setSelectedRows((prev) => [...prev, ...selectedRows])
    //     },
    //     onSelectAll: (selected, selectedRows, changeRows) => {
    //         setIsSelectAll(selected)
    //     }


    // };


    const handleRowSelectionChange = (newSelectedKeys: React.Key[]) => {
        // Identify keys that were deselected
        const deselectedKeys = selectedRowKeys.filter(key => !newSelectedKeys.includes(key));
    
        // Update deselected keys globally
        setDeselectedRowKeys(prev => {
            const updatedDeselectedKeys = [
                ...prev.filter(key => !newSelectedKeys.includes(key)), // Retain only keys that are not newly selected
                ...deselectedKeys, // Add newly deselected keys
            ];
            return Array.from(new Set(updatedDeselectedKeys)); // Ensure unique values
        });
        
        // Update selected keys
        setSelectedRowKeys(newSelectedKeys);
    };

    const rowSelection = {
        type: "checkbox",
        preserveSelectedRowKeys: true,
        onChange: handleRowSelectionChange,
        selectedRowKeys,
        onSelectAll: (selected, selectedRows, changeRows) => {
            setIsSelectAllChange(true)
            if (selected) {
                const allKeys = userListData.data.map(user => user.id);
                setSelectedRowKeys(allKeys);
                setDeselectedRowKeys([]);
                setIsSelectAll(true);
            } else {
                setSelectedRowKeys([]);
                setDeselectedRowKeys([]);
                setIsSelectAll(false);
            }
        },
    };
   
    // console.log("isSelectAll",isSelectAll);
    
    useEffect(() => {
        if(isSelectAllChange){
            if (isSelectAll) {
                const newIds = userListData.data
                    .map(user => user.id) // Map all user IDs
                    .filter(id => !deselectedRowKeys.includes(id)); // Exclude deselected rows
    
                if (newIds.length > 0) {
                    setSelectedRowKeys(prevSelectedKeys => {
                        // Combine previous and new selections without duplicates
                        const combinedKeys = new Set([...prevSelectedKeys, ...newIds]);
                        return Array.from(combinedKeys);
                    });
                }
            }else{
                setSelectedRowKeys([])
                setIsSelectAllChange(false)
            }
        }
       
    }, [isSelectAll, userListData, deselectedRowKeys]);

    // console.log("selectedRowKeys",selectedRowKeys);
    

    const showNotificationModal = () => {
        setIsNotificationModalOpen(true);
    };

    const handleOk = () => {
        setIsNotificationModalOpen(false);
        setValue("messageTitle", "");
        setValue("messageBody", "");
        setValue("url", "");
    };


    const handleWhatsappTemplate = async () => {
        const response = await GetWhatsappTemplates();
        if (response.success) {
            setIsWhatsAppModalOpen(true)
            const updatedData = response.data.map((elm) => ({
                ...elm,
                label: elm.name
            }))
            setWhatsappTemplateList(updatedData)
        }
    }

    // UseEffect For Dispatch UserList
    useEffect(() => {
        if (loginUserData && loginUserData?.data && loginUserData?.data[0]?.roleid === 1) {
            dispatch(fetchUserList(userDetailPayload));
        }
    }, [userDetailPayload, loginUserData]);



    // UseEffect For Get TotalCount
    useEffect(() => {
        if (userListData && userListData?.data) {
            setTotalItems(userListData?.data[0]?.totalcount)
            const updatedUserListDataValues = userListData?.data?.map((elm, index) => ({
                ...elm, key: elm.id
            }))
            setUpdatedUserListData(updatedUserListDataValues)
        }
    }, [userListData])

    useEffect(() => {
        return () => {
            setUserDetailPayload(initialState);
        }
    }, [])


return (
    <div className="relative min-h-screen">
        <UserDetailsScene {...{
            UserListColumn,
            updatedUserListData,
            isLoading,
            totalItems,
            handleTableChange,
            setSelectionType,
            selectionType,
            rowSelection,
            selectedRows,
            selectedRowKeys,
            setSelectedRows,
            showNotificationModal,
            handleOk,
            setValue,
            isNotificationModelOpen,
            formState,
            register,
            handleSubmit,
            setIsNotificationModalOpen,
            setIsWhatsAppModalOpen,
            isWhatsappTemplateOpen,
            handleWhatsappTemplate,
            WhatsappTemplateList,
            handleChangeWhatsappTemplate,
            control,
            onSubmit,
            whatsappTemplateSubmit
        }} />
    </div>
);
}

export default UserDetailsContainer