import { Form, Input, Space, Switch } from 'antd';
import { SwitchClickEventHandler } from 'antd/lib/switch';
import React from 'react';
import { regExpIpAddressWithLocalhost } from '../../../lib/util/validation';

export type FormIpAddressWithLocalhostProps = {
  label: string;
  name: string;
  disabled?: boolean;
  onClick?: () => void;
  localhost: boolean;
  onClickLocalhost: SwitchClickEventHandler;
};

function FormIpAddressWithLocalhost({
  label,
  name,
  disabled = false,
  localhost,
  onClickLocalhost,
}: FormIpAddressWithLocalhostProps): JSX.Element {
  return (
    <Form.Item
      label={<Label localhost={localhost} onClickLocalhost={onClickLocalhost} />}
      name={name}
      rules={[
        {
          required: true,
          message: `Please input ${label.toLocaleLowerCase()}!`,
        },
        {
          message: `The address must be in the form of xxx.xxx.xxx.xxx!`,
          pattern: regExpIpAddressWithLocalhost(),
        },
      ]}
    >
      <Input disabled={disabled} />
    </Form.Item>
  );
}

export type LabelProps = {
  localhost: boolean;
  onClickLocalhost: SwitchClickEventHandler;
};
function Label({ localhost, onClickLocalhost }: LabelProps): JSX.Element {
  return (
    <Space size="middle">
      <div>IP Address</div>
      <Switch
        size="small"
        checkedChildren="localhost"
        unCheckedChildren="localhost"
        checked={localhost}
        onClick={onClickLocalhost}
      />
    </Space>
  );
}

export default React.memo(FormIpAddressWithLocalhost);
