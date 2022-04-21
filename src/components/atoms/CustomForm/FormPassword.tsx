import { Form, Input } from 'antd';
import React from 'react';

export type FormPasswordProps = {
  label: string;
  name: string;
  disabled?: boolean;
  onClick?: () => void;
};

function FormPassword({ label, name, disabled = false, onClick }: FormPasswordProps): JSX.Element {
  // const Tooltip = () => (
  //   <div>
  //     <p>{`Characters that can be entered: alphabet, number, Special Characters !@#$%^&*()_-+=<>?`}</p>
  //     <p>Allowed to be at least 6 characters long and up to 30 characters long.</p>
  //   </div>
  // );

  return (
    <Form.Item
      label={label}
      name={name}
      rules={[
        { required: true, message: `Please input ${label.toLocaleLowerCase()}!` },
        // {
        //   message: `Please input in the correct format! See tooltip!`,
        //   pattern: new RegExp(/[0-9a-zA-Z!@#$%^&*()_\-+=<>?]{6,30}$/, 'g'),
        // },
      ]}
      // tooltip={{
      //   title: Tooltip,
      // }}
    >
      <Input.Password disabled={disabled} visibilityToggle={false} onClick={onClick} />
    </Form.Item>
  );
}

export default React.memo(FormPassword);
