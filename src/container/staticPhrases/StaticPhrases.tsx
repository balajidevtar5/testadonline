import React, { useEffect, useRef, useState, useContext } from "react";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { message, Table, Input, Space, Button } from "antd";
import { IconButton } from "@mui/material";
import { SearchOutlined } from "@mui/icons-material";
import StaticPhrasesStyles from "./StaticPhrasesStyles.module.scss";
import {
  getStaticPhrasesAPI,
  AddUpdateStaticPhrasessAPI,
} from "../../redux/services/staticphrases.api";
import BottomNavigationComponent from "../../components/bottomNavigation/bottomNavigation";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { LayoutContext } from '../../components/layout/LayoutContext';

const PhrasesContainer = () => {
  const initialState = {
    "SearchText": "",
    "SearchLanguage": "",
    "SearchValue": "",
    "DisplayText": "",
    "PageSize": 10,
    "PageNumber": 1,
    "SortColumn": "LanguageName",
    "SortDirection": "ASC"
  };
  const [phrasesPayload, setPhrasesPayload] = useState(initialState);
  const [phrasesData, setPhrasesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const tableRef = useRef(null);
  const searchInput = useRef(null);
  const  { isDarkMode } = useContext(LayoutContext);
  const [selectedColor, setSelectedColor] = useState(isDarkMode ? "#242424" :"#fff");
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to fetch data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getStaticPhrasesAPI(phrasesPayload);
      if (response) {
        setPhrasesData(response.data);
        setTotalItems(response.data[0]?.totalcount);
      }
    } catch (error) {
      message.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [phrasesPayload]);

  // Handle search
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    const updatedPayload = { ...phrasesPayload, PageNumber: 1 };
    
    if (dataIndex === "textcode") {
      updatedPayload.SearchText = selectedKeys[0] || "";
    } else if (dataIndex === "SearchValue") {
      updatedPayload.SearchValue = selectedKeys[0] || "";
    } else if (dataIndex === "language name") {
      updatedPayload.SearchLanguage = selectedKeys[0] || "";
    }
    
    setPhrasesPayload(updatedPayload);
  };

  

  // Handle reset (Fixed to fetch all data)
  const handleReset = (clearFilters, dataIndex) => {
    clearFilters({ confirm: true });
    const updatedPayload = { ...phrasesPayload, PageNumber: 1 };
    
    if (dataIndex === "textcode") {
      updatedPayload.SearchText = "";
    } else if (dataIndex === "SearchValue") {
      updatedPayload.SearchValue = "";
    } else if (dataIndex === "language name") {
      updatedPayload.SearchLanguage = "";
    }
    
    updatedPayload.SortColumn = "LanguageName";
    updatedPayload.SortDirection = "ASC";
    
    setPhrasesPayload(updatedPayload);
  };

  
  const commonsearchstyle = {
    color: "#63636370",
    width: "18px",
    height: "18px",
    mr: "3px",
  };

  const getColumnSearchProps = (dataIndex: string) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 , backgroundColor: selectedColor, color: isDarkMode ? "#fff" : "#000"}}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" , color: isDarkMode ? "#fff" : "#000", }}
          className={isDarkMode ? "dark-placeholder" : ""}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            size="small"
            style={{ width: 90 , }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters, dataIndex)} size="small" style={{ width: 90 }}>
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
    // onFilter: (value: string, record: any) =>
    //   record[dataIndex]
    //     ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
    //     : "",
  });
  
  const phrasesColumns = [
    {
      title: "Text Code",
      dataIndex: "textcode",
      sorter: true,
      ...getColumnSearchProps("textcode"),
    },
    {
      title: "Language",
      dataIndex: "languagename",
      sorter: true,
      ...getColumnSearchProps("language name"),
    },
    {
      title: "Value",
      dataIndex: "DisplayText",
      sorter: true,
      ...getColumnSearchProps("SearchValue"),
      render: (_: any, record: any) => {
        // Limit text to two lines
        const truncateText = (text, limit = 150) =>
          text.length > limit ? text.slice(0, limit) + "..." : text;
  
        return editingRow === record.id ? (
          record.controltype === "TextField" ? (
            <Input
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
              onPressEnter={() => handleSave(record)}
            />
          ) : (
            <ReactQuill
              value={editingValue}
              onChange={(value) => setEditingValue(value)}
            />
          )
        ) : (
          <span
            onClick={() => handleEdit(record)}
            style={{ cursor: "pointer", whiteSpace: "pre-wrap" }}
          >
            {isExpanded ? record.displaytext : truncateText(record.displaytext)}
            {record.displaytext.length > 150 && (
              <span
                style={{ color: isDarkMode ? "#D3D3D3" : "#000", fontWeight: "bold", cursor: "pointer"}}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering row edit
                  setIsExpanded(!isExpanded);
                }}
              >
                {isExpanded ? " See less" : " See more"}
              </span>
            )}
          </span>
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_: any, record: any) =>
        editingRow === record.id ? (
          <div>
            <IconButton onClick={() => handleSave(record)}>
              <SaveOutlinedIcon className="text-green" />
            </IconButton>
            <IconButton onClick={handleCancel}>
              <span className="text-red font-medium font-15">Cancel</span>
            </IconButton>
          </div>
        ) : (
          <Button onClick={() => handleEdit(record)}>Edit</Button>
        ),
    },
  ];

  const handleEdit = (record: any) => {
    setEditingRow(record.id);
    setEditingValue(record.displaytext);
  };


  const handleSave = async (record) => {
    if (editingValue !== record.displaytext) {
      const payload = {
        StaticTexts: [
          {
            Id: record.id,
            TextCode: record.textcode,
            LanguageId: record.languageid,
            Value: editingValue,
          },
        ],
      };

      try {
        await AddUpdateStaticPhrasessAPI(payload);
        message.success("Value updated successfully!");
        fetchData();
      } catch {
        message.error("Failed to update value.");
      }
    }
    setEditingRow(null);
  };

  const handleCancel = () => {
    setEditingRow(null);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    const updatedPayload = {
      ...phrasesPayload,
      PageSize: pagination.pageSize,
      PageNumber: pagination.current,
    };

    if (sorter.field && sorter.order) {
      updatedPayload.SortColumn = sorter.field;
      updatedPayload.SortDirection = sorter.order === "ascend" ? "ASC" : "DESC";
    } else {
      updatedPayload.SortColumn = "LanguageName";
      updatedPayload.SortDirection = "ASC";
    }

    setPhrasesPayload(updatedPayload);
  };
  useEffect(() => {
      return () => {
        setPhrasesPayload(initialState);
      };
    }, []);
  
  return (
    <div className="pb-20" style={{ paddingBottom: "70px"  }}>
      <Table
        columns={phrasesColumns}
        dataSource={phrasesData}
        loading={isLoading}
        rowKey="id"
        onChange={handleTableChange} 
        pagination={{
          className: "mb-16",
          position: ["bottomCenter"],
          pageSize: phrasesPayload.PageSize,
          current: phrasesPayload.PageNumber,
          total: totalItems,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          style: { 
            position: "sticky"
          }
        }}
        scroll={{x : 600, y: 550 }}
        className={`${StaticPhrasesStyles.tableWithFixedPagination} overflow-y-hidden mt-60`}
      />
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNavigationComponent />
      </div>
    </div>
    
  );
};

export default PhrasesContainer;
