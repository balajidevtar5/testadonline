import React from 'react';
import GTranslateIcon from '@mui/icons-material/GTranslate';
import { SelectField } from '../formField/FormFieldComponent';

interface LanguageDropdownProps {
  register: any;
  formState: any;
  control: any;
  languageList: any[];
  handleChangeLanguage: (value: any) => void;
}

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  register,
  formState,
  control,
  languageList,
  handleChangeLanguage,
}) => (
  <div className="position-relative language-ddl d-xs-none">
    <SelectField
      {...{
        register,
        formState,
        control,
        id: "language",
        name: "language",
        isSearchable: true,
        styles: {
          control: (base: any) => ({
            ...base,
            border: 0,
            boxShadow: "none",
          }),
        },
      }}
      placeholder="Select language"
      options={languageList}
      onSelectChange={handleChangeLanguage}
      isClearable={false}
      isMulti={false}
    />
    <GTranslateIcon className="translate-icon" />
  </div>
);

export default LanguageDropdown; 