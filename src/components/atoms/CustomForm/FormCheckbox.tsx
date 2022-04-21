import React from 'react';
import { css } from '@emotion/react';
import { Checkbox, CheckboxProps, Form, FormItemProps } from 'antd';

export interface FormCheckboxProps<Values> {
  itemProps?: Partial<FormItemProps<Values>>;
  checkboxProps?: Partial<CheckboxProps>;
  text?: string;
}
function FormCheckbox<Values>({ itemProps, checkboxProps, text }: FormCheckboxProps<Values>): JSX.Element {
  return (
    <Form.Item {...itemProps}>
      <Checkbox {...checkboxProps}>{text}</Checkbox>
    </Form.Item>
  );
}
export default React.memo(FormCheckbox);
