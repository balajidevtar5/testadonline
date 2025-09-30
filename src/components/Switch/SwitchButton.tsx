import React from "react";
import SwitchStyles from "./SwitchStyles.module.scss";
import { Switch } from "@mui/material";
export interface SwitchButtonProps {
    onChange?: (d: any) => void;
    defaultChecked?: boolean;
    checkedChildren?: string;
    unCheckedChildren?: string;
}

const SwitchButton = (props: any) => {
    const { onChange, defaultChecked,} = props;
    return (
        <>
            <Switch
                defaultChecked={defaultChecked}
                onChange={onChange}
            />
        </>
    );
};

export default SwitchButton;
