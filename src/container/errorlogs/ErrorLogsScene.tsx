import { Table } from 'antd';
import React from 'react'
import BottomNavigationComponent from '../../components/bottomNavigation/bottomNavigation';

interface ErrorLogsProps {
    errorLogsColumn?: any;
    errorLogListData?:any;
    totalItems?:number;
    handleTableChange?:any;
    rowSelection?:any;
    selectionType?:any
}
  
const ErrorLogsScene = (props: ErrorLogsProps) => {
    const { errorLogsColumn,errorLogListData,totalItems,handleTableChange,rowSelection,selectionType } = props;

    return (
        <>
        <div style={{marginBottom:"70px"}} >
            <Table
                columns={errorLogsColumn}
                dataSource={errorLogListData?.data || []}
                pagination={{
                    total: totalItems,
                }}
               
                onChange={handleTableChange}
                className="overflow-y-hidden mt-60"
            />

        </div>
        <BottomNavigationComponent />
        </>
    )
}

export default ErrorLogsScene