import React, { useEffect, useRef, useState ,useContext} from "react";
import { TableColumnsProps } from "../../libs/types";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserList } from "../../redux/slices/users";
import { RootState } from "../../redux/reducer";
import { changeDateFormat } from "../../libs/helper";
import { Button, DatePicker, Input, Space } from "antd";
import { SearchOutlined } from "@mui/icons-material";
import UserDetailStyles from "../userDetails/UserDetailsStyles.module.scss";
import UserActivityScene from "./UserActivityScene";
import { fetchUserActivityLogs } from "../../redux/slices/userActivity";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import BottomNavigationComponent from "../../components/bottomNavigation/bottomNavigation";
import { LayoutContext } from '../../components/layout/LayoutContext';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const UserActivityContainer = () => {
  const dispatch: any = useDispatch();
  const searchInput = useRef(null);
  const [searchArray, setSearchArray] = useState([]);
  const initialState = {
    Search: "",
    PageSize: 10,
    PageNumber: 1,
    SortColumn: "",
    SortDirection: "",
  };
  const [userActivityPayload, setUserActivityPayload] = useState(initialState);
  const { data: userActivityData, isLoading } = useSelector(   (state: RootState) => state.userActivity  );
  const { data: loginUserData } = useSelector(  (state: RootState) => state.loginUser  );
  const [totalItems, setTotalItems] = useState(null);
  const [updatedUserActivityData, setUpdatedUserActivityData] = useState([]);
  const [tableKey, setTableKey] = useState(0);
  const  { isDarkMode } = useContext(LayoutContext);
  const [selectedColor, setSelectedColor] = useState(isDarkMode ? "#242424" :"#fff");
  
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
   
    confirm();
    setSearchArray((prevSearchArray) => {
      const updatedSearchArray = [...prevSearchArray];
      const existingIndex = updatedSearchArray.findIndex(
        (entry) => entry.key === dataIndex
      );
      
      if (existingIndex > -1) {
        updatedSearchArray[existingIndex].value = selectedKeys[0];
      } else {
        updatedSearchArray.push({ key: dataIndex, value: selectedKeys[0] });
      }
  
      const dataIndexToPayloadKey = {
        users: "UsernameSearch",
        displayname: "DisplaynameSearch",
        location: "Location", 
        jsondata: "JsonDataSearch",
      };
  
      setUpdatedUserActivityData([]);
      const updatedPayload = { ...userActivityPayload, PageNumber: 1 };

      if (dataIndex === "datestamp") {
        const [from, to] = selectedKeys[0];
        updatedPayload["FromDate"] = from;
        updatedPayload["ToDate"] = to;
      }

      Object.keys(dataIndexToPayloadKey).forEach((key) => {
        const entry = updatedSearchArray.find((entry) => entry.key === key);
        updatedPayload[dataIndexToPayloadKey[key]] = entry ? entry.value : null;
      });
  
      setUserActivityPayload(updatedPayload);
      return updatedSearchArray;
    });
  };

  const handleReset = (clearFilters, dataIndex) => {
    clearFilters({ confirm: true });
    setSearchArray((prevSearchArray) =>
      prevSearchArray.filter((item) => item?.key !== dataIndex)
    );
  
    const dataIndexToPayloadKey = {
      users: "UsernameSearch",
      displayname: "DisplaynameSearch",
      location: "Location", 
      jsondata: "JsonDataSearch",
      datestamp: "ActivityTimeSearch",  
    };
  
    setUpdatedUserActivityData([]);
    const payloadKeyToRemove = dataIndexToPayloadKey[dataIndex];
    if (payloadKeyToRemove) {
      setUserActivityPayload((prevPayload) => {
        const updatedPayload = { ...prevPayload };
        delete updatedPayload[payloadKeyToRemove];
        return updatedPayload;
      });
    }
  
    setUserActivityPayload((prevPayload) => {
      const updatedPayload = { ...prevPayload };
      delete updatedPayload[dataIndexToPayloadKey[dataIndex]];
  
      if (dataIndex === "datestamp") {
        delete updatedPayload["FromDate"];
        delete updatedPayload["ToDate"];
      }
  
      updatedPayload.PageNumber = 1; // Reset to first page
      return updatedPayload;
    });
    // setTableKey((prevKey) => prevKey + 1);
  };
  

  const getColumnSearchProps = (dataIndex, isDateRange = false) => ({
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
          backgroundColor: selectedColor,
          color: isDarkMode ? "#fff" : "#000",
          border: isDarkMode ? "1px solid #444" : "1px solid #d9d9d9", 
        }}
        onKeyDown={(e) => e.stopPropagation()}
        className="antclass"
      >
        {isDateRange ? (
          <DatePicker.RangePicker 
            value={
              selectedKeys[0] &&
              Array.isArray(selectedKeys[0]) &&
              selectedKeys[0].length === 2
                ? [dayjs(selectedKeys[0][0]), dayjs(selectedKeys[0][1])]
                : [null, null]
            }
            onChange={(dates, dateStrings) => {
              const [startDate, endDate] = dateStrings;
              setSelectedKeys(
                startDate && endDate ? [[startDate, endDate]] : []
              );
            }}
            className={`mobile-date-picker ${isDarkMode ? "dark" : ""}`}
            style={{ marginBottom: 8, display: "block" , backgroundColor: selectedColor, color: isDarkMode ? "#fff" : "#000" }}
          />
        ) : (
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value.trim()] : [])
            }
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{
              marginBottom: 8,
              display: "block",
              backgroundColor: selectedColor,
             color: isDarkMode ? "#fff" : "#000", 
            }}
          />
        )}
        <Space>
          <Button
            type="primary"
            disabled={
              isDateRange
                ? !(selectedKeys[0] && selectedKeys[0].length === 2)
                : !selectedKeys[0]
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
              backgroundColor: selectedColor,
              color: isDarkMode ? "#fff" : "#000",
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              clearFilters && handleReset(clearFilters, dataIndex);
              setSelectedKeys([]);
            }}
            size="small"
            style={{
              width: 90,
              backgroundColor: selectedColor,
              color: isDarkMode ? "#fff" : "#000",
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
          border: "none", 
          background: "transparent",
          width: "18px",
          height: "18px",
          mr: "3px",
        }}
      />
    ),
    onFilter: (value, record) => {
      if (dataIndex === 'location') {
        // Safely handle null or undefined values
        const searchValue = value?.toString().trim().toLowerCase() || '';
        const cityName = record[dataIndex]?.toString().trim().toLowerCase() || '';
        return cityName.includes(searchValue);
      }
      if (isDateRange && Array.isArray(value) && value.length === 2) {
        const [startDate, endDate] = value.map(v => dayjs(v));
        const recordDate = dayjs(record[dataIndex]);
        
        return (
          recordDate.isSameOrAfter(startDate.startOf("day")) &&
          recordDate.isSameOrBefore(endDate.endOf("day"))
        );
      }
    
      const searchValue = value?.toString().trim().toLowerCase() || '';
      const recordValue = record[dataIndex]?.toString().trim().toLowerCase() || '';
      return recordValue.includes(searchValue);
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) => text,
  });

  const userActivityColumn: TableColumnsProps[] = [
    {
      title: "User Name",
      dataIndex: "users",
      key: 1,
      sorter: true,
      ...getColumnSearchProps("users"),
    },
    {
      title: "Activity Name",
      dataIndex: "displayname",
      key: 2,
      ...getColumnSearchProps("displayname"),
      sorter: true,
    },
    {
      title: "Activity Time",
      dataIndex: "datestamp",
      key: 3,
      sorter: true,
      ...getColumnSearchProps("datestamp", true),
      render: (datestamp) => {
        return changeDateFormat(datestamp);
      },
    },
    {
      title: "City Name",
      dataIndex: "location",
      key: 4,
      sorter: true,
      ...getColumnSearchProps("location"),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: 5,
    },
    
    {
      title: "JSON Data",
      dataIndex: "jsondata",
      key: 6,
      sorter: true,
      ...getColumnSearchProps("jsondata"),
      render: (tourl, record) => {
        if (!record.jsondata) return null;

        let jsonData = JSON.parse(record.jsondata) as Record<string, any>; // Explicitly cast to an object

        return (
          <pre>
            {"{"}
            {Object.entries(jsonData).map(([key, value], index, array) => (
              <div key={key} style={{ display: "inline" }}>
                &nbsp;&nbsp;"{key}":&nbsp;
                {key === "PostId" ? (
                  <a href={record.shareposturl} target="_blank" rel="noopener noreferrer">
                    {String(value)}
                  </a>
                ) : (
                  JSON.stringify(value)
                )}
                {index < array.length - 1 ? "," : ""}
              </div>
            ))}
            {"}"}
          </pre>
        );
      }
    },
  ];

  const handleTableChange = (pagination, filters, sorter, extra) => {
    const updatedPayload = {
      ...userActivityPayload,
      PageSize: pagination.pageSize,
      PageNumber: pagination.current,
    };
   
    if (sorter && sorter.field) {
      const sortColumn = sorter.field === 'locationname' ? 'CityName' : sorter.field;
      updatedPayload.SortColumn = sortColumn;
      updatedPayload.SortColumn = sorter.field;
      updatedPayload.SortDirection = sorter.order
        ? sorter.order === "descend"
          ? "desc"
          : "asc"
        : null;
    } else {
      updatedPayload.SortColumn = null;
      updatedPayload.SortDirection = null;
    }

    setUserActivityPayload(updatedPayload);
  };

  useEffect(() => {
    if (
      loginUserData &&
      loginUserData?.data &&
      loginUserData?.data[0]?.roleid === 1
    ) {
      setUpdatedUserActivityData([]);
      dispatch(fetchUserActivityLogs(userActivityPayload));
      
    }
  }, [userActivityPayload, loginUserData]);

  useEffect(() => {
    if (userActivityData && userActivityData?.data) {
      setTotalItems(userActivityData?.data[0]?.totalcount);
      const updatedUserListDataValues = userActivityData?.data?.map((elm) => ({
        ...elm,
        key: elm.userid,
      }));
      setUpdatedUserActivityData([]);
      setTimeout(() => setUpdatedUserActivityData(updatedUserListDataValues), 0); 
    }
  }, [userActivityData]);

  useEffect(() => {
    return () => {
      setUserActivityPayload(initialState);
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      <div className="pb-20">
        <UserActivityScene
          {...{
            userActivityColumn,
            updatedUserActivityData,
            isLoading,
            totalItems,
            handleTableChange,
            tableKey,
            userActivityPayload,
          }}
        />
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNavigationComponent />
      </div>
    </div>
  );
};

export default UserActivityContainer;