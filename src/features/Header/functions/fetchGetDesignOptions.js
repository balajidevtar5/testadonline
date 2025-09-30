import { UnorderedListOutlined, AppstoreOutlined } from "@ant-design/icons";
import { GetDesinOption } from "../../../libs/constant";
export const fetchGetDesignOptions = ({ selectedGridOption }) => {
  return GetDesinOption.map((option) => {
    const isSelected = option.id === selectedGridOption;
    const icon =
      option.id === 1 ? (
        <UnorderedListOutlined
          className={`font-22 ${isSelected ? "text-primary" : "text-black-500"}`}
        />
      ) : (
        <AppstoreOutlined
          className={`font-22 ${isSelected ? "text-primary" : "text-black-500"}`}
        />
      );
    return {
      ...option,
      icon,
    };
  });
};
