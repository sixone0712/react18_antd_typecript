import { css } from '@emotion/react';
import { Form, InputNumber } from 'antd';
import React from 'react';

export type FormPortProps = {
  label: string;
  name: string;
  disabled?: boolean;
  onClick?: () => void;
};

function FormPort({ label, name, disabled = false }: FormPortProps): JSX.Element {
  return (
    <Form.Item
      label={label}
      name={name}
      rules={[
        {
          required: true,
          message: `Please input ${label.toLocaleLowerCase()}!`,
        },
        {
          message: `The port must be greater than 1 and less than 65535!`,
          type: 'number',
          validator: (rule, value) =>
            new Promise((resolve, reject) => {
              if (!value) return resolve(true);
              return +value > 0 && +value <= 65535 ? resolve(true) : reject(false);
            }),
        },
      ]}
    >
      <InputNumber
        disabled={disabled}
        min={1}
        max={65535}
        formatter={(value) => {
          return value ? JSON.stringify(Math.floor(value)) : '';
        }}
        css={css`
          width: 100%;
        `}
      />
    </Form.Item>
  );
}

export default React.memo(FormPort);
