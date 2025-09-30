import React from "react";
import { Table } from "antd";

const UserActivityScene = ({
  userActivityColumn,
  updatedUserActivityData,
  isLoading,
  totalItems,
  handleTableChange,
  tableKey,
  userActivityPayload,
}) => {
  return (
    <div className="pb-20" style={{ marginBottom: "70px" }}>  
      <Table
        key={tableKey}
        columns={userActivityColumn}
        dataSource={updatedUserActivityData || []}
        loading={isLoading}
        pagination={{
          position: ["bottomCenter"],
          current: userActivityPayload.PageNumber,
          pageSize: userActivityPayload.PageSize,
          total: totalItems,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          className: "mb-16" 
        }}
        onChange={handleTableChange}
        className="overflow-y-hidden mt-60" 
      />
    </div>
  );
};

export default UserActivityScene;