import React, { useEffect, useRef, useState, useContext } from 'react'
import { TableColumnsProps } from '../../libs/types';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserList } from '../../redux/slices/users';
import { RootState } from '../../redux/reducer';
import { changeDateFormat } from '../../libs/helper';
import { Button, DatePicker, Input, message, Popover, Space } from 'antd';
import { ElevenMp, SearchOutlined } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { pushNotificationApi } from '../../redux/services/user.api';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { GetWhatsappTemplates, SendWhatsappMessage } from '../../redux/services/common.api';
import { LayoutContext } from '../../components/layout/LayoutContext';
import ShortenURLSeen from './ShortelUrlSeen';
import { MoreOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next';
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { AddUpdateUrl, DeleteUrl, GetRedirection } from '../../redux/services/ShortenUrl';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// Extend dayjs with the isBetween plugin
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
interface DataType {
    key: React.Key;
    dataIndex: string;
    age: number;
    address: string;
}

const ShortenURLContainer = () => {
    const dispatch: any = useDispatch();
    const [searchArray, setSearchArray] = useState([]);
    const initialState = {
        Search: "",
        PageSize: 10,
        PageNumber: 1,
        SortColumn: "toUrl",
        SortDirection: "desc",
    }
    const [shortenURLPayload, setShortenURLPayload] = useState(initialState)
    const searchInput = useRef(null);
    const { data: userListData, isLoading } = useSelector((state: RootState) => state.userList);
    const { data: loginUserData } = useSelector((state: RootState) => state.loginUser);
    const [totalItems, setTotalItems] = useState(null)
    const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>('checkbox');
    const [selectedRows, setSelectedRows] = useState([])
    const [updatedShortenURLData, setUpdatedUserListData] = useState([])
    const [isSelectAll, setIsSelectAll] = useState(false)
    const [isShortenURLModelOpen, setIsAddShortenURLModalOpen] = useState(false)
    const [isWhatsappTemplateOpen, setIsWhatsAppModalOpen] = useState(false)
    const [WhatsappTemplateList, setWhatsappTemplateList] = useState([])
    const [shortenURLData, setShortenURLData] = useState([])
    const [editPostData, setEditPostData] = useState(null)
    const { t } = useTranslation();

    const validationSchema = yup.object().shape({
        name: yup
            .string()
            .required('Name is required')
            .min(3, 'Name must be at least 3 characters')
            .max(50, 'Name must not exceed 50 characters'),
        FromURL: yup
            .string()
            .required('From URL is required')
            .max(50, 'From URL must not exceed 50 characters'),
        ToURL: yup
            .string()
            .required('To URL is required')
            .matches(
                /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                'Please enter a valid URL'
            )
    });


    const { register, formState: { errors }, control, handleSubmit, setValue, reset } = useForm({
        resolver: yupResolver(validationSchema)
    });

    const [deselectedRowKeys, setDeselectedRowKeys] = useState([]);
    const [selectedTemplate, setSlectedTemplate] = useState(null);
    const [isDeletePopup, setIsDeleteDialog] = useState(false)


    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchArray(prevSearchArray => {
            const updatedSearchArray = [...prevSearchArray, { key: dataIndex, value: selectedKeys[0] }];

            const dataIndexToPayloadKey = {
                tourl: 'toURL',
                fromurl: 'fromurl',
                name: 'name'
            };

            const updatedPayload = { ...shortenURLPayload };

            if (dataIndex === "datestamp") {
                const [from, to] = selectedKeys[0];
                updatedPayload["FromDate"] = from;
                updatedPayload["ToDate"] = to;
            }

            Object.keys(dataIndexToPayloadKey).forEach((key) => {
                const entry = updatedSearchArray.find((entry) => entry.key === key);
                updatedPayload[dataIndexToPayloadKey[key]] = entry ? entry.value : null;
            });

            //updatedSearchArray.forEach(entry => {
            //    const payloadKey = dataIndexToPayloadKey[entry.key];
            //    if (payloadKey) {
            //        updatedPayload[payloadKey] = entry.value;
            //    }
            //});
            setShortenURLPayload(updatedPayload);
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
            toURL: 'toURL',
            fromUrl: 'fromUrl',
            name: 'name'
        };
        // Get the payload key for the given dataIndex
        const payloadKeyToRemove = dataIndexToPayloadKey[dataIndex];
        if (payloadKeyToRemove) {
            // If the payload key exists, create a copy of shortenURLPayload and remove the relevant key
            const updatedPayload = { ...shortenURLPayload };
            delete updatedPayload[payloadKeyToRemove];
            // Set the updated payload state
            setShortenURLPayload(updatedPayload);
        }

    };


    const handleChangeWhatsappTemplate = (value) => {
        setSlectedTemplate(value)

    }


    const { isDarkMode } = useContext(LayoutContext);
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
                        className={`btn-primary d-flex align-items-center `}
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
                    color: isDarkMode ? "#fff" : "#63636370", // White in dark mode, default color otherwise
                    width: "18px",
                    height: "18px",
                    mr: "3px",
                }}
            />
        ),
        //onFilter: (value, record) => {
        //    if (isDateRange && Array.isArray(value) && value.length === 2) {
        //        const [startDate, endDate] = value.map((v) => dayjs(v));
        //        const recordDate = dayjs(record[dataIndex]);

        //        // Use inclusive range check with end of day for the end date
        //        return (
        //            recordDate.isSameOrAfter(startDate.startOf("day")) &&
        //            recordDate.isSameOrBefore(endDate.endOf("day"))
        //        );
        //    }

        //    return (
        //        record[dataIndex] !== null &&
        //        record[dataIndex]?.toLowerCase()?.includes(value?.toLowerCase())
        //    );
        //},
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) => text,
    });

    const handleEditClick = (data) => {
        setValue("name", data.name)
        setValue("ToURL", data.tourl)
        setValue("FromURL", data.fromurl)
    }
    const ShortenColumn: TableColumnsProps[] = [

        {
            title: "Name",
            dataIndex: "name",
            key: 1,
            sorter: true,
            ...getColumnSearchProps("name"),
        },
        {
            title: "From URL",
            dataIndex: "fromurl",
            key: 2,
            ...getColumnSearchProps("fromurl"),
            sorter: true,
            render: (tourl, record) => {
                return <a href={record.fromurl} target="_blank" rel="noopener noreferrer">{record.fromurl}</a>;
            }
        },
        {
            title: "To URL",
            dataIndex: "tourl",
            key: 3,
            ...getColumnSearchProps("tourl"),
            sorter: true,
            render: (tourl, record) => {
                return <a href={record.tourl} target="_blank" rel="noopener noreferrer">{record.tourl}</a>;
            }
        },
        {
            title: "Activity Time",
            dataIndex: "datestamp",
            key: 4,
            sorter: true,
            ...getColumnSearchProps("datestamp", true),
            render: (datestamp) => {
                return changeDateFormat(datestamp);
            },
        },
        {
            title: "Action",
            dataIndex: "lastlogin",
            key: 5,
            render: (lastlogin, record) => {
                const content = (
                    <div>
                        <div
                            className="d-flex cursor-pointer align-items-center pb-5"
                            onClick={(e) => {
                                setEditPostData(record);
                                handleEditClick(record)
                                setIsAddShortenURLModalOpen(true)
                            }}
                        >
                            <ModeEditOutlinedIcon
                                className="mr-10 text-green cursor-pointer"
                                sx={{ fontSize: "20px" }}

                            />
                            <span className={`${isDarkMode ? 'text-white' : 'text-grey'}`}>
                                {t("General.Edit")}
                            </span>
                        </div>

                        <div
                            onClick={(e) => {
                                setEditPostData(record);
                                setIsDeleteDialog(true)
                            }}
                            className="pt-5 pb-5 d-flex cursor-pointer align-items-center"
                        >
                            <DeleteOutlineIcon
                                className="mr-10 text-danger"
                                sx={{ fontSize: "20px" }}
                            />
                            <span className={`${isDarkMode ? 'text-white' : 'text-grey'}`}>
                                {t("General.Delete")}
                            </span>
                        </div>
                    </div>
                );
                return (
                    <Popover placement="bottomLeft" content={content}
                        overlayClassName="popover-padding"
                    >
                        <Button><MoreOutlined /></Button>
                    </Popover>
                );
            }
        }
    ];

    const handleTableChange = (e, filters, sorter, extra) => {
        setShortenURLPayload({ ...shortenURLPayload, PageSize: e.pageSize, PageNumber: e.current })
        if (sorter.order === undefined) {
            setShortenURLPayload({ ...shortenURLPayload, PageSize: e.pageSize, PageNumber: e.current, SortColumn: "fromUrl", SortDirection: "desc" })
        } else {
            if (Object.keys(sorter).length > 0) {
                setShortenURLPayload({ ...shortenURLPayload, PageSize: e.pageSize, PageNumber: e.current, SortColumn: sorter.field, SortDirection: sorter.order == "descend" ? "desc" : "asc" })
            }
        }

    }


    const whatsappTemplateSubmit = async () => {
        const payload = {
            "templateId": selectedTemplate?.id,
            "templateName": selectedTemplate?.name,
            "userIds": isSelectAll && deselectedRowKeys,
            "isSelectAll": isSelectAll
        }

        const keyMapping = {
            "username": "UsernameSearch",
            "location": "LocationSearch",
            "mobileno": "PhoneSearch",
            "lastlogin": ["FromDate", "ToDate"] // Since lastlogin is an array
        };



        if (isSelectAll) {
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

        if (response.success) {
            message.success(response.message);
            setIsWhatsAppModalOpen(false);
        }
    }


    const handleFormSubmit = async (data: any) => {
        try {
            const payload = {
                toUrl: data.ToURL,
                fromUrl: data.FromURL,
                name: data.name,
                id: 0
            }
            if (editPostData) {
                payload.id = editPostData?.id
            }
            const response = await AddUpdateUrl(payload)
            if (response?.success) {
                setIsAddShortenURLModalOpen(false)
                if (loginUserData && loginUserData?.data && loginUserData?.data[0]?.roleid === 1) {
                    fetchGetRedirection()
                }
            }
        } catch (error) {

        }

    };

    const showNotificationModal = () => {
        setIsAddShortenURLModalOpen(true);
    };

    const handleOk = () => {
        setIsAddShortenURLModalOpen(false);
        setValue("name", "");
        setValue("FromURL", "");
        setValue("ToURL", "");
    };


    const handleWhatsappTemplate = async () => {
        const response = await GetWhatsappTemplates();
        if (response?.success) {
            setIsWhatsAppModalOpen(true)
            const updatedData = response.data.map((elm) => ({
                ...elm,
                label: elm.name
            }))
            setWhatsappTemplateList(updatedData)
        }
    }


    const fetchGetRedirection = async () => {
        const response = await GetRedirection(shortenURLPayload);

        if (response?.success) {
            setShortenURLData(response.data)
            setTotalItems(response.data[0]?.totalrecords)
        }
    }

    const handleAddClick = () => {
        setIsAddShortenURLModalOpen(true)
        setEditPostData([])
        setValue("name", "")
        setValue("ToURL", "")
        setValue("FromURL", "")
    }

    const deleteAd = async (data) => {
        try {
            const payload = {
                id: data.id
            }
            const response = await DeleteUrl(payload)
            if (response?.success) {
                setIsDeleteDialog(false)
                fetchGetRedirection()
            }
        } catch (error) {

        }
    }
    // UseEffect For Dispatch UserList
    useEffect(() => {
        if (loginUserData && loginUserData?.data && loginUserData?.data[0]?.roleid === 1) {
            // dispatch(fetchUserList(shortenURLPayload));


            fetchGetRedirection()
        }
    }, [shortenURLPayload, loginUserData]);



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
            setShortenURLPayload(initialState);
        }
    }, [])


    return (
        <div className="relative min-h-screen">
            <ShortenURLSeen {...{
                ShortenColumn,
                updatedShortenURLData,
                isLoading,
                totalItems,
                handleTableChange,
                setSelectionType,
                selectionType,
                selectedRows,
                setSelectedRows,
                showNotificationModal,
                handleOk,
                setValue,
                isShortenURLModelOpen,
                formState: { errors },
                register,
                handleSubmit,
                setIsAddShortenURLModalOpen,
                setIsWhatsAppModalOpen,
                isWhatsappTemplateOpen,
                handleWhatsappTemplate,
                WhatsappTemplateList,
                handleChangeWhatsappTemplate,
                control,
                whatsappTemplateSubmit,
                shortenURLData,
                editPostData,
                handleFormSubmit,
                setIsDeleteDialog,
                isDeletePopup,
                deleteAd,
                handleAddClick
            }} />
        </div>
    );
}

export default ShortenURLContainer