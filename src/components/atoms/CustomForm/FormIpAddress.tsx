import { Form, Input } from 'antd';
import React from 'react';
import { regExpIpAddress } from '../../../lib/util/validation';

export type FormIpAddressProps = {
  label: string;
  name: string;
  disabled?: boolean;
  onClick?: () => void;
};

function FormIpAddress({ label, name, disabled = false }: FormIpAddressProps): JSX.Element {
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
          message: `The address must be in the form of xxx.xxx.xxx.xxx!`,
          pattern: regExpIpAddress(),
        },
      ]}
    >
      <Input disabled={disabled} />
    </Form.Item>
  );
}

export default React.memo(FormIpAddress);
