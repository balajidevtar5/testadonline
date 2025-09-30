import React from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GTranslateIcon from '@mui/icons-material/GTranslate';
import { SelectField } from '../../../components/formField/FormFieldComponent';

export const LocationLanguageSelector = ({
  selectedCityName,
  setIsLocationPicker,
  register,
  formState,
  control,
  languageList,
  handleChangeLanguage
}) => {
  return (
    <div className="d-flex city-ddl d-xs-none">
      <div
        className="flex items-center location-data ml-20"
        onClick={() => setIsLocationPicker(true)}
      >
        <LocationOnIcon />{" "}
        <span className="mr-10">{selectedCityName}</span>{" "}
        <ExpandMoreIcon className="expand-border" />
      </div>
      <div className="position-relative language-ddl">
        <SelectField
          {...{
            register,
            formState,
            control,
            id: "language",
            name: "language",
            isSearchable: true,
            styles: {
              control: (base) => ({
                ...base,
                border: 0,
                boxShadow: "none",
              }),
            },
          }}
          placeholder="Select language"
          options={languageList}
          onSelectChange={(e) => handleChangeLanguage(e)}
          isClearable={false}
          isMulti={false}
        />
        <GTranslateIcon className="translate-icon" />
      </div>
    </div>
  );
};