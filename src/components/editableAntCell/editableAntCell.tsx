import React from 'react';
import { Input, Switch } from 'antd';
import { CONTROL_TYPE_ENUM } from '../../libs/constant';
import SwitchButton from '../Switch/SwitchButton';
import TextArea from 'antd/es/input/TextArea';

const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleEdit,
    ...restProps
}) => {
    const inputRef = React.useRef(null);

    let childNode = children;
    if (editable) {
        childNode = (
            <>
                {record?.controltype === CONTROL_TYPE_ENUM.TextField && (
                    <Input
                        ref={inputRef}
                        defaultValue={record[dataIndex]}
                        onChange={(e) => handleEdit(record.id, dataIndex, e.target.value)}
                    />
                )}
                {record?.controltype === CONTROL_TYPE_ENUM.Toggle && (
                    <SwitchButton
                        defaultChecked={record[dataIndex] === "1" ? true : false}
                        onChange={(e) => handleEdit(record.id, dataIndex, e.target.checked ? "1" : "0")}
                    />
                )}
                {record?.controltype === CONTROL_TYPE_ENUM?.TextArea && (
                    <TextArea
                        defaultValue={record[dataIndex]}
                        onChange={(e) => handleEdit(record.id, dataIndex, e.target.value)}
                    />
                )}
            </>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

export default EditableCell;
