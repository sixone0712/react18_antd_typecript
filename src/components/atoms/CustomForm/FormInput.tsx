import { LoadingOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Form, Input } from 'antd';
import React, { ChangeEventHandler } from 'react';
export type FormInputProps = {
  label: string;
  name: string;
  formClassName?: string;
  inputClassName?: string;
  loading?: boolean;
  disabled?: boolean;
  required?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
};

export default function FormInput({
  label,
  name,
  formClassName,
  inputClassName,
  loading = false,
  disabled = false,
  required = false,
  onChange,
  placeholder,
}: FormInputProps): JSX.Element {
  return (
    <Form.Item
      label={label}
      name={name}
      rules={[
        {
          required: required,
          message: `Please input ${label.toLocaleLowerCase()}!`,
        },
      ]}
      required={required}
      css={style(loading)}
      className={formClassName}
    >
      <Input
        className={inputClassName}
        disabled={disabled}
        onChange={onChange}
        placeholder={placeholder}
        addonAfter={
          loading && (
            <LoadingOutlined
              style={{
                color: 'rgba(0, 0, 0, 0.25)',
                fontSize: 12,
              }}
            />
          )
        }
      />
    </Form.Item>
  );
}

const style = (loading: boolean) => css`
  .ant-input-group-addon {
    background-color: rgb(245, 245, 245);
  }
  .ant-input {
    border-right: ${loading && '0px'};
  }
`;
