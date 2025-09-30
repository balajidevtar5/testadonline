import React, { useEffect, useState } from "react";
import {
  AddUpdateSettingsAPI,
  getAllSettingsAPI,
} from "../../redux/services/setting.api";
import SettingScene from "./SettingScene";
import { TableColumnsProps } from "../../libs/types";
import { LoginUserState } from "../../redux/slices/auth";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/reducer";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { message } from "antd";
import BottomNavigationComponent from "../../components/bottomNavigation/bottomNavigation";
import { IconButton } from "@mui/material";
const SettingContainer = () => {
  const { data: loginUserData }: LoginUserState = useSelector(
    (state: RootState) => state.loginUser
  );
  const [isLoading, setIsLoading] = useState(false);
  const [dataSource, setDataSource] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const settingColumns: TableColumnsProps[] = [
    {
      title: "Service Id",
      dataIndex: "id",
      sorter: true,
      width: '135px',
    },
    {
      title: "Service Name",
      dataIndex: "name",
      sorter: true,
    },
    {
      title: "Value",
      dataIndex: "value",
      sorter: true,
      editable: true,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (actions, resDetails) => getActions(resDetails),
    },
  ];
  const handleSaveValue = async (data, key) => {
    try {
      const payload = {
        Settings: [
          {
            Id: data.id,
            Name: data.name,
            Value: data.value,
          },
        ],
      };
      const response = await AddUpdateSettingsAPI(payload);
      if (response?.success) {
        message.success(response.message);
        getSettingList(false);
      } else {
        message.error(response.message);
      }
    } catch (error) {
    }
  };
  const handleEdit = (key, dataIndex, value) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => key === item.id);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, { ...item, [dataIndex]: value });
      setDataSource(newData);
    }
  };
  const mergedColumns = settingColumns.map((col: any) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable:
          record.controltype === "TextField" || record.controltype === "Toggle",
        dataIndex: col.dataIndex,
        title: col.title,
        handleEdit,
      }),
    };
  });

  const getActions = (resDetails) => {
    if (resDetails) {
      const originalRow = initialData.find((row) => row.id === resDetails.id);
      let isAmountEdited =
        originalRow && resDetails.value !== originalRow.value;

      const rowKey = `action-${resDetails.id}`;

      return (
        <>
          <div className="flex items-center justify-between px-2">
            <IconButton disabled={!isAmountEdited} key={rowKey}>
              <SaveOutlinedIcon
                className={!isAmountEdited ? "text-disabled" : "text-green"}
                onClick={() => handleSaveValue(resDetails, rowKey)}
              />
            </IconButton>
          </div>
        </>
      );
    }
  };

  const getSettingList = async (isSetDataSource) => {
    try {
      setIsLoading(true);
      const response = await getAllSettingsAPI();
      if (response?.success) {
        setIsLoading(false);
        if (isSetDataSource) {
          setDataSource(response.data);
        }
        setInitialData(response.data);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (loginUserData?.data && loginUserData?.data[0]?.roleid === 1)
      getSettingList(true);
  }, [loginUserData?.data]);

  useEffect(() => {
    return () => {
      setDataSource(null);
      setIsLoading(false);
    };
  }, []);

  
  return (
    <div className="relative min-h-screen">
      <div className="pb-20">
        <SettingScene
          {...{
            settingColumns,
            dataSource,
            isLoading,
            mergedColumns
          }}
        />
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNavigationComponent />
      </div>
    </div>
  );
};

export default SettingContainer;
