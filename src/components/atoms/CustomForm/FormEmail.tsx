import { Form, Input } from 'antd';
import React from 'react';

export type FormEmailProps = {
  label: string;
  name: string;
  disabled?: boolean;
  onClick?: () => void;
};

function FormEmail({ label, name, disabled = false }: FormEmailProps): JSX.Element {
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
          type: 'email',
          message: `The e-mail must be in the form of xxx@xxx.com!`,
        },
      ]}
    >
      <Input disabled={disabled} />
    </Form.Item>
  );
}

export default React.memo(FormEmail);
