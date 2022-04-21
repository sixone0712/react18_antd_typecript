import { css } from '@emotion/react';
import { Form, Select } from 'antd';
import { SelectValue } from 'antd/lib/select';
import React from 'react';

export type FormSelectMultiple<T> = {
  label: string;
  name: string;
  options: T[] | undefined;
  ObjkeyName?: string;
  ObjvalueName?: string;
  ObjLabelName?: string;
  disabled?: boolean;
  loading?: boolean;
  mode?: 'multiple' | 'tags' | undefined;
  required?: boolean;
  placeholder?: React.ReactNode;
  onSelect?: (value: SelectValue) => void;
  onChange?: (value: any) => void;
  labelInValue?: boolean;
  className?: string;
  etc?: any;
};

function FormSelectMultiple<T>({
  label,
  name,
  options,
  ObjkeyName,
  ObjvalueName,
  ObjLabelName,
  disabled = false,
  loading = false,
  mode,
  required = true,
  placeholder,
  onSelect,
  onChange,
  labelInValue = false,
  className,
  etc = undefined,
}: FormSelectMultiple<T>): JSX.Element {
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
      className={className}
    >
      <Select
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
        {...etc}
      >
        {options &&
          options.length > 0 &&
          options?.map((item: any) => (
            <Select.Option key={ObjkeyName ? item[ObjkeyName] : item} value={ObjvalueName ? item[ObjvalueName] : item}>
              {ObjLabelName ? item[ObjLabelName] : item}
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

export default FormSelectMultiple;
