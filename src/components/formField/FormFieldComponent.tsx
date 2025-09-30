import {
    Autocomplete,
    Checkbox,
    FormControl,
    FormControlLabel,
    InputAdornment,
    Radio,
    RadioGroup
} from '@mui/material';
import TextField from '@mui/material/TextField';
import { useContext, useEffect, useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import Select, { components } from "react-select";
import { LayoutContext } from '../../components/layout/LayoutContext';
import React from 'react';

interface InputProps {
    onChange?: (d: any) => void;
    autoFocus?: any;
    name: string;
    label?: string;
    className?: string;
    type?: string;
    placeholder?: string;
    id: string;
    variant?: string;
    value?: any;
    style?: any;
    register: any;
    formState: any;
    control: any;
    prefix?: any;
    params?: any;
    startAdornment?: any;
    endAdornment?: any;
    onInput?: any;
    autoComplete?: string;
    multiline?: boolean;
    maxRows?: number;
    maxLength?: number;
    watchField?: any;
    parentClassName?: any;
    InputLabelProps?: any;
    shrink?: any,
    readOnly?: any
    onClick?:any,
    isDisable?:any,

}

interface tagInputProps {
    options: any;
    onChange?: (d: any, value: any) => void;
    onKeyDown?: (d: any) => void;
    onDeleteTag?: (d: any) => void;
    autoFocus?: any;
    name: string;
    label?: string;
    className?: string;
    type?: string;  
    placeholder?: string;
    id: string;
    variant?: string;
    value?: any;
    style?: any;
    register: any;
    formState: any;
    params?: any;
    autoComplete?: string;
    multiline?: boolean;
    maxRows?: number;
    multiple: boolean;
    onClick?:any
}

interface SelectFieldProps {
    register: any;
    formState: any;
    control: any;
    id: string;
    name: string;
    label?: string;
    defaultValue?: any;
    placeholder?: string;
    className?: string;
    onSelect?: (relationship: any) => void;
    autoCapitalize?: string;
    showError?: boolean;
    options?: any;
    isClearable?: boolean;
    isSearchable?: boolean;
    isMulti?: boolean;
    autoComplete?: boolean;
    setValue?: any;
    disabled?: boolean;
    value?: any;
    onSelectChange?: (d: any) => void;
    onBlur?: (d: any) => void;
    formatOptionLabel?: any;
    menuIsOpen?: boolean;
    hideSelectedOptions?: boolean;
    defaultMenuIsOpen?: boolean;
    autoFocus?: boolean;
    handleMenuOpen?: any;
    handleMenuClose?: any;
    menuPortalTarget?: any;
    styles?: any;
    menuPlacement?: string;
    classNamePrefix?: any;
    formatValueContainer?: (selected: any[]) => string;
}

export default function InputField({
    onChange,
    autoFocus,
    name,
    label,
    className,
    type = "text",
    value,
    placeholder,
    id,
    style,
    autoComplete,
    register,
    multiline,
    formState,
    watchField,
    maxRows,
    onClick,
    params,
    maxLength,
    startAdornment,
    control,
    variant = "outlined",
    onInput,
    prefix = null,
    parentClassName,
    InputLabelProps,
    shrink,
    endAdornment,
    readOnly,
    isDisable,
    ...props
}: InputProps) {
    const [error, setError] = useState(null);
    useEffect(() => {
        if (
            formState &&
            formState?.errors &&
            formState?.errors[id] &&
            formState?.errors[id].message
        ) {
            setError(formState?.errors[id].message);
        }
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        return () => {
            setError(null);
        };
    }, [formState]);

    return (
        <div className={parentClassName}>
            <Controller
                control={control}
                name={id}
                render={({ field }) => (
                    <TextField
                        {...register(id)}
                        error={error}
                        id={id}
                        label={label}
                        name={name}
                        autoFocus={autoFocus}
                        disabled={isDisable}
                        onChange={(value) => {
                            field.onChange(value);
                            if (onChange) {
                                onChange(value);
                            }
                        }}
                        onInput={onInput}
                        prefix={prefix}
                        type={type}
                        maxRows={maxRows}
                        style={style}
                        className={className}
                        value={value}
                        placeholder={placeholder}
                        autoComplete={autoComplete}
                        variant={variant}
                        onClick={onClick}
                        multiline={multiline}
                        inputProps={{
                            maxLength: maxLength, className: className, readOnly: readOnly,
                        }}
                        InputProps={{
                            startAdornment: startAdornment,
                            endAdornment: endAdornment
                        }}
                        InputLabelProps={{
                            // shrink: watchField.MobileNo !== "" && true,
                            // focused: true
                            // shrink: value  && true
                            shrink: shrink

                        }}
                        fullWidth
                        {...props}
                    />
                )} />
            {error && (
                <p
                    style={{
                        color: 'red',
                        fontSize: 'small',
                        marginTop: '1px',
                        display: "flex",
                        justifyContent: "flex-start"
                    }}
                >
                    {error}
                </p>
            )}
        </div>
    )
}

export function InputRadio({ value, onChange, items }: any) {
    return (
        <FormControl>
            <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={value}
                onChange={onChange}
            >
                {items.map((item: any) => (
                    <FormControlLabel
                        key={item.id}
                        value={item.value}
                        control={<Radio />}
                        label={item.title}
                    />
                ))}
            </RadioGroup>
        </FormControl>
    )
}

export const TagInput = ({ options, onChange, id, name, label, autoFocus, value, multiple, className }: tagInputProps) => {
    return (
        <div className={className}>
            <Autocomplete
                style={{ maxWidth: "100%", minWidth: "240px" }}
                id="combo-box-demo"
                options={options}
                freeSolo
                value={value}
                multiple={multiple}
                onChange={onChange}
                renderInput={(params) =>
                    <TextField {...params}
                        id={id}
                        label={label}
                        name={name}
                        autoFocus={autoFocus}
                    />
                }
            />
        </div>
    )
}

export const SelectField = (props: SelectFieldProps) => {
  const {
    formState,
    id,
    control,
    name,
    register,
    label,
    placeholder,
    defaultValue,
    showError = true,
    options,
    disabled,
    isClearable = true,
    isSearchable = true,
    className = "react-select",
    isMulti,
    onSelectChange,
    formatOptionLabel,
    onBlur,
    hideSelectedOptions = false,
    defaultMenuIsOpen = false,
    menuPlacement,
    styles,
    autoFocus = false,
    menuPortalTarget,
    classNamePrefix,
    formatValueContainer,
  } = props;
  const showCheckbox = id === "cities";
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !(wrapperRef.current as any).contains(event.target)
      ) {
        setIsMenuOpen(false);
        if (onBlur) onBlur({} as React.FocusEvent); 
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  useEffect(() => {
    if (formState?.errors?.[id]?.message) {
      setError(formState.errors[id].message);
    }
    return () => setError(null);
  }, [formState]);

  const customComponents = {
    ...(formatValueContainer && {
        
        // ValueContainer: (valueProps: any) => {
        //     const selected = valueProps.getValue();
        //     const isEmpty = !selected || selected.length === 0;
          
        //     return (
        //       <components.ValueContainer {...valueProps}>
        //       {valueProps.children}
        //       <span
        //         style={{
        //           padding: "0 5px",
        //           left: 10,
        //           color: isEmpty ? '#999999' : 'inherit',
        //           zIndex: 0
        //         }}
        //       >
        //         {formatValueContainer(selected)}
        //       </span>
        //     </components.ValueContainer>
        //     );
        //   },
          
        MultiValue: (props: any) => {
          const { selectProps } = props;
          const { isDarkMode } = React.useContext(LayoutContext);
          const isEmpty = !selectProps || selectProps.length === 0;
          // Get all selected values
          const allSelected = selectProps.value || [];
          
          // Only render for the first multi-value item
          if (props.index === 0 && allSelected.length > 0) {
            return (
              <div
                style={{
                  color: isEmpty ? '#999999' : 'inherit',
                  borderRadius: '2px',
                }}
              >
                <span style={{ color: isDarkMode ? '#e2e8f0' : '#1a202c' }}>
                  {`${allSelected.length} ${allSelected.length === 1 ? 'city' : 'cities'} selected`}
                </span>
              </div>
            );
          }
          
          // Don't render other multi-values
          return null;
        }
    }),
    ...(showCheckbox && {
      Option: (props: any) => {
        const { data, isSelected, isFocused, innerRef, innerProps, selectProps } = props;
        const { isDarkMode } = React.useContext(LayoutContext);
      
        const isSelectAllOption = data.value === "__all__";
        const allOptions = selectProps.options.filter((opt: any) => opt.value !== "__all__");
        const selectedValues = selectProps.value || [];
      
        const allSelected = allOptions.length > 0 && allOptions.every((opt: any) =>
          selectedValues.some((val: any) => val.value === opt.value)
        );
      
        const handleSelectAll = () => {
          const isDeselecting = allSelected;
          const newValue = isDeselecting ? [] : allOptions;
      
          selectProps.onChange(newValue, {
            action: isDeselecting ? "deselect-all" : "select-all",
          });
        };
      
        const handleClick = () => {
          if (isSelectAllOption) {
            handleSelectAll();
          } else {
            innerProps?.onClick?.(new MouseEvent("click"));
          }
        };
      
        return (
          <div
            ref={innerRef}
            {...innerProps}
            onClick={handleClick}
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: isFocused
                ? isDarkMode
                  ? "#2d3748"
                  : "#e3f2fd"
                : isDarkMode
                  ? "#1a202c"
                  : "white",
              cursor: "pointer",
              color: isDarkMode ? "#e2e8f0" : "inherit",
            }}
          >
            <Checkbox
              checked={isSelectAllOption ? allSelected : isSelected}
              tabIndex={-1}
              disableRipple
              size="small"
              sx={{
                color: "#ff9800",
                "&.Mui-checked": {
                  color: "#ff9800",
                },
                paddingRight: "8px",
              }}
            />
            <span
              style={{
                fontWeight: isSelected ? 600 : 400,
                color: isDarkMode ? "#e2e8f0" : "inherit",
              }}
            >
              {data.label}
            </span>
          </div>
        );
      },
      
    }),
  };

  return (
    <div ref={wrapperRef}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            {...register(id)}
            className={`${className} ${error ? "select-error" : ""}`}
            defaultValue={defaultValue}
            placeholder={placeholder}
            isClearable={isClearable}
            isSearchable={isSearchable}
            formatOptionLabel={formatOptionLabel}
            isMulti={isMulti}
            options={options}
            disabled={disabled}
            onChange={(value) => {
              field.onChange(value);
              if (onSelectChange) {
                onSelectChange(value);
              }
            }}
            onBlur={(e: any) => {
              if (onBlur) {
                onBlur(e);
              }
            }}
            value={field.value}
            ref={field?.ref}
            classNamePrefix={id === "cities" ? "city-select" : "react-select select"}
            hideSelectedOptions={hideSelectedOptions}
            menuPlacement={menuPlacement}
            styles={styles}
            autoFocus={autoFocus}
            
            menuPortalTarget={menuPortalTarget}
            menuIsOpen={isMenuOpen}
            onMenuOpen={() => setIsMenuOpen(true)}
            onMenuClose={() => setIsMenuOpen(false)}
            {...(showCheckbox && {
              closeMenuOnSelect: false,
              blurInputOnSelect: false,
            })}
            components={customComponents}
          />
        )}
      />
      {showError && error && (
        <p
          style={{
            color: "red",  
            fontSize: "small",
            marginTop: "1px",
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
};


export const TextAreaField = (props: any) => {
    const {
        register,
        formState,
        id,
        label,
        placeholder,
        defaultValue,
        className,
        autoCapitalize,
        autoComplete,
        minLength,
        rows,
        maxLength,
        min,
        max,
        onInput,
        showError = true,
        disabled,
        readOnly,
        draggable,
        onChange = null,
        onKeyDown = null,
        parentClass,
        style
    } = props;
    const [error, setError] = useState(null);
    useEffect(() => {
        if (
            formState &&
            formState?.errors &&
            formState?.errors[id] &&
            formState?.errors[id].message
        ) {
            setError(formState?.errors[id].message);
        }
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        return () => {
            setError(null);
        };
    }, [formState]);
    return (
        <>
            {label && (
                <div className="block pb-1 font-medium">
                    <label htmlFor={id}>{label}</label>
                </div>
            )}
            <textarea
                {...register(id)}
                {...{
                    id,
                    className: `${className} `,
                    defaultValue,
                    autoCapitalize,
                    autoComplete,
                    placeholder,
                    minLength,
                    maxLength,
                    onInput,
                    min,
                    max,
                    disabled,
                    rows,
                    readOnly,
                    draggable,
                    style
                }}
                onKeyUp={(e: any) => {
                    if (onChange) {
                        onChange(e);
                    }
                }}
                onKeyDown={(e: any) => {
                    if (onKeyDown) {
                        onKeyDown(e);
                    }
                }}
            />
            {showError && error && (
                <p
                    style={{
                        color: 'red',
                        fontSize: 'small',
                        marginTop: '1px',
                        display: "flex",
                        justifyContent: "flex-start"
                    }}
                >
                    {error}
                </p>
            )}
        </>
    );
};

interface CheckboxFieldProps {
  name: string;
  id: string;
  label?: string;
  control: any;
  register: any;
  formState: any;
  defaultValue?: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
  className?: string;
  showError?: boolean;
}

export const CheckboxField = ({
  name,
  id,
  label,
  control,
  register,
  formState,
  defaultValue = false,
  disabled = false,
  onChange,
  className,
  showError = true
}: CheckboxFieldProps) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      if (formState?.errors?.[id]?.message) {
          setError(formState.errors[id].message);
      }
      return () => setError(null);
  }, [formState]);

  return (
      <div className={className}>
          <Controller
              name={name}
              control={control}
              defaultValue={defaultValue}
              render={({ field }) => (
                  <FormControlLabel
                      control={
                          <Checkbox
                              {...register(name)}
                              checked={field.value}
                              onChange={(e) => {
                                  field.onChange(e.target.checked);
                                  if (onChange) onChange(e.target.checked);
                              }}
                              disabled={disabled}
                          />
                      }
                      label={label}
                  />
              )}
          />
          {showError && error && (
              <p
                  style={{
                      color: 'red',
                      fontSize: 'small',
                      marginTop: '1px',
                      display: "flex",
                      justifyContent: "flex-start"
                  }}
              >
                  {error}
              </p>
          )}
      </div>
  );
};
