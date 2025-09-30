import React, { useEffect, useRef, useState ,useContext} from 'react'
import { TableColumnsProps } from '../../libs/types';
import { useDispatch, useSelector } from 'react-redux';
import { changeDateFormat } from '../../libs/helper';
import { Button, Input, Space } from 'antd';
import { SearchOutlined } from '@mui/icons-material';
import UserDetailStyles from "../userDetails/UserDetailsStyles.module.scss";
import ErrorLogsScene from './ErrorLogsScene';
import { useForm } from 'react-hook-form';
import { RootState } from '../../redux/reducer';
import { fetchErrorLog } from '../../redux/slices/errorlogs';
import InfoIcon from '@mui/icons-material/Info';
import styled from '@emotion/styled';
import { Tooltip, TooltipProps, tooltipClasses } from '@mui/material';
import { LayoutContext } from '../../components/layout/LayoutContext';
const ErrorLogsContainer = () => {
    const dispatch: any = useDispatch();
    const searchInput = useRef(null);
    const [searchArray, setSearchArray] = useState([]);

    const initialState = {
        Search: "",
        PageSize: 10,
        PageNumber: 1,
        SortColumn: "CreatedTime",
        SortDirection: "desc",
    }
    const [errorLogPayload, setErrorLogPayload] = useState(initialState)
    const { data: errorLogListData, isLoading } = useSelector((state: RootState) => state.errorLogList);
    const { data: loginUserData } = useSelector((state: RootState) => state.loginUser);
    const [totalItems, setTotalItems] = useState(null)
    const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>('checkbox');
    const [selectedRows, setSelectedRows] = useState([])
    const [updatedUserListData, setUpdatedUserListData] = useState([])
    const [isNotificationModelOpen, setIsNotificationModalOpen] = useState(false)
    const { register, formState, watch, control, handleSubmit, setValue } = useForm();
    const  { isDarkMode } = useContext(LayoutContext);
    const [selectedColor, setSelectedColor] = useState(isDarkMode ? "#242424" :"#fff");

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();

    };

    const handleReset = (clearFilters: (confirm) => void, dataIndex) => {
        clearFilters({ confirm: true });

    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
            close,
        }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
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
                <Space>
                    <Button
                        type="primary"
                        className={`"btn-primary d-flex align-items-center ${UserDetailStyles.searchFilter}`}
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined sx={{ color: "#63636370", width: "18px", height: "18px", mr: "3px" }} />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters, dataIndex)}
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
            <SearchOutlined sx={{ color: "#63636370", width: "18px", height: "18px", mr: "3px" }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex] !== null && record[dataIndex].toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) => text,
    });

    const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
        <Tooltip arrow {...props} classes={{ popper: className }} />
    ))({
        [`& .${tooltipClasses.tooltip}`]: {
            maxWidth: 700,
            backgroundColor: isDarkMode ? "#242424" : "#fff",
            color: "grey",
            shapeOutside: "none",
            boxShadow: "0 0 0 0.1rem rgba(0,0,0,0.1)",
        },
    });


    const errorLogsColumn: TableColumnsProps[] = [
        {
            title: "Created Time",
            dataIndex: "createdtime",
            sorter: true,
        },
        {
            title: "Id",
            dataIndex: "id",
            sorter: true,
        },
        {
            title: "Inner Exception",
            dataIndex: "innerexception",
            sorter: true,
            render: (innerexception) => (
                <span>{innerexception ?? "N/A"}</span>
            )
        },
        {
            title: "Message",
            dataIndex: "message",
            sorter: true,
            render: (message) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {message.length > 20 ? (
                            <>
                                <span>{message.substring(0, 20)}...</span>
                                <CustomWidthTooltip title={message}>
                                    <span style={{ marginLeft: '4px', marginTop: "6px" }}><InfoIcon style={{ fontSize: "1rem", color: "grey", marginLeft: "3px" }} /></span>
                                </CustomWidthTooltip>
                            </>
                        ) : (
                            <span>{message}</span>
                        )}
                    </div>
                );
            }
        },
        {
            title: "Source",
            dataIndex: "source",
            sorter: true,
        },
        {
            title: "Stack Trace",
            dataIndex: "stacktrace",
            sorter: true,
            render: (stacktrace) => {
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {stacktrace.length > 20 ? (
                            <>
                                <span>{stacktrace.substring(0, 20)}...</span>
                                <CustomWidthTooltip title={stacktrace}>
                                    <span style={{ marginLeft: '4px', marginTop: "6px" }}><InfoIcon style={{ fontSize: "1rem", color: "grey", marginLeft: "3px" }} /></span>
                                </CustomWidthTooltip>
                            </>
                        ) : (
                            <span>{stacktrace}</span>
                        )}
                    </div>
                );
            }
        },
        {
            title: "Target Site",
            dataIndex: "targetsite",
            sorter: true,
        },
    ];

    const handleTableChange = (e, filters, sorter, extra) => {
        setErrorLogPayload({ ...errorLogPayload, PageSize: e.pageSize, PageNumber: e.current })
        if (Object.keys(sorter).length > 0) {
            setErrorLogPayload({ ...errorLogPayload, PageSize: e.pageSize, PageNumber: e.current, SortColumn: sorter.field, SortDirection: sorter.order == "descend" ? "desc" : "asc" })
        }
    }
    useEffect(() => {
        if (loginUserData && loginUserData?.data && loginUserData?.data[0]?.roleid === 1) {
            dispatch(fetchErrorLog(errorLogPayload));
        }
    }, [errorLogPayload, loginUserData]);

    useEffect(() => {
        return () => {
            setErrorLogPayload(initialState)
        }
    }, [])
    return (
        <div>

            <ErrorLogsScene {...{
                errorLogsColumn,
                errorLogListData,
                errorLogPayload,
                handleTableChange
            }} />
        </div>
    )
}

export default ErrorLogsContainer