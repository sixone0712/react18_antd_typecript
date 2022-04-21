import { Form, Input } from 'antd';
import React from 'react';

export type FormConfirmPasswordProps = {
  label: string;
  name: string;
  compareFieldName?: string;
  disabled?: boolean;
  onClick?: () => void;
};

function FormConfirmPassword({
  label,
  name,
  disabled = false,
  compareFieldName = 'password',
  onClick,
}: FormConfirmPasswordProps): JSX.Element {
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
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue(compareFieldName) === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('The two passwords that you entered do not match!'));
          },
        }),
      ]}
      // tooltip={{
      //   title: Tooltip,
      // }}
    >
      <Input.Password disabled={disabled} visibilityToggle={false} onClick={onClick} />
    </Form.Item>
  );
}

export default React.memo(FormConfirmPassword);
