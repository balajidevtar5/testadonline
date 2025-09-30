import { Table } from "antd";
import React from "react";
import EditableCell from "../../components/editableAntCell/editableAntCell";
import BottomNavigationComponent from "../../components/bottomNavigation/bottomNavigation";

interface SettingSceneProps {
  settingColumns: any;
  isLoading: boolean;
  dataSource: any;
  mergedColumns: any;
}

const SettingScene = (props: SettingSceneProps) => {
  const { isLoading, settingColumns, dataSource, mergedColumns } = props;

  return (
    <div className="pb-20" style={{ marginBottom: "70px" }}>
      <Table
        rowKey="id"
        columns={mergedColumns}
        dataSource={dataSource || []}
        loading={isLoading}
        rowClassName={() => "editable-row"}
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        pagination={{
          position: ["bottomCenter"],
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          defaultPageSize: 10,
          className: "mb-16"  // Added margin to prevent overlap
        }}
        className="overflow-y-hidden mt-60"
      />
      <BottomNavigationComponent />
    </div>
  );
};

export default SettingScene;