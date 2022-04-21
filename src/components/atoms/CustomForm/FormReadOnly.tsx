import React from 'react';
import { css } from '@emotion/react';
import { Form, Input } from 'antd';
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
export type FormReadOnlyProps = {
  label: string;
  name: string;
  formClassName?: string;
  inputClassName?: string;
  loading?: boolean;
  required?: boolean;
};

export default function FormReadOnly({
  label,
  name,
  formClassName,
  inputClassName,
  loading = false,
  required = false,
}: FormReadOnlyProps): JSX.Element {
  return (
    <Form.Item
      label={label}
      name={name}
      rules={[
        {
          required: true,
          message: `Please input ${label.toLocaleLowerCase()}!`,
        },
      ]}
      required={required}
      css={style(loading)}
      className={formClassName}
    >
      <Input
        className={inputClassName}
        disabled
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
