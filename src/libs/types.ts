import React from "react";

export interface TableFilterObject {
    text: string;
    value: string;
}
export interface TableColumnsProps {
    title: any;
    dataIndex: string;
    sorter?: boolean;
    editable?: boolean;
    key?: React.Key;
    fixed?: boolean;
    render?: any;
    width?: string;
    filters?: TableFilterObject[];
    sortOrder?: any
}