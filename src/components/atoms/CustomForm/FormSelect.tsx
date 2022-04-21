import { css } from '@emotion/react';
import { Form, Select } from 'antd';
import { LabelTooltipType } from 'antd/lib/form/FormItemLabel';
import { SelectProps } from 'antd/lib/select';
import React from 'react';

export interface FormSelectProps<T> extends SelectProps<T> {
  label: string;
  name: string;
  ObjkeyName?: string;
  ObjvalueName?: string;
  ObjLabelName?: string | string[];
  required?: boolean;
  formClassName?: string;
  selectClassName?: string;
  onSelect?: (value: any, option: any[number]) => void;
  onChange?: (value: any, option: any[number] | any) => void;
  options: any[] | undefined;
  tooltip?: LabelTooltipType;
}

function FormSelect<T>({
  label,
  name,
  required,
  formClassName,
  options,
  ObjkeyName,
  ObjvalueName,
  ObjLabelName,
  selectClassName,
  mode,
  disabled,
  loading,
  placeholder,
  onSelect,
  labelInValue,
  onChange,
  allowClear,
  onClear,
  tooltip,
}: FormSelectProps<T>): JSX.Element {
  return (
    <Form.Item
      label={label}
      name={name}
      required={required}
      rules={[
        {
          required: required,
          message: `Please select ${label.toLocaleLowerCase()}!`,
        },
      ]}
      className={formClassName}
      tooltip={tooltip}
    >
      <Select
        className={selectClassName}
        mode={mode}
        showArrow
        showSearch={false}
        // disabled={disabled}
        css={disabled && diabledStyle}
        loading={loading}
        placeholder={placeholder}
        onSelect={onSelect}
        labelInValue={labelInValue}
        onChange={onChange}
        onClear={onClear}
        allowClear={allowClear}
      >
        {options &&
          options.length > 0 &&
          options?.map((item: any) => (
            <Select.Option key={ObjkeyName ? item[ObjkeyName] : item} value={ObjvalueName ? item[ObjvalueName] : item}>
              {ObjLabelName
                ? Array.isArray(ObjLabelName)
                  ? ObjLabelName.map((obj) => item[obj]).join(' / ')
                  : item[ObjLabelName]
                : item}
            </Select.Option>
          ))}
      </Select>
    </Form.Item>
  );
}

const diabledStyle = css`
  cursor: not-allowed;
  .ant-select-selector {
    background-color: #f5f5f5 !important;
    color: rgba(0, 0, 0, 0.25);
    pointer-events: none;
    border-color: rgb(217, 217, 217) !important;
  }
`;

//export default React.memo(FormSelectMultiple);

export default FormSelect;
