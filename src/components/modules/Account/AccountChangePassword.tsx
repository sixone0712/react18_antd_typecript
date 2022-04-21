import { Form, Modal } from 'antd';
import React from 'react';
import useAccountChangePassword from '../../../hooks/useAccountChangePassword';
import FormConfirmPassword from '../../atoms/CustomForm/FormConfirmPassword';
import FormPassword from '../../atoms/CustomForm/FormPassword';

export type AccountChangePasswordProps = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AccountChangePassword({ visible, setVisible }: AccountChangePasswordProps): JSX.Element {
  const { form, handleOk, handleCancel, isFetching } = useAccountChangePassword({ visible, setVisible });

  return (
    <Modal
      title="Change Password"
      visible={visible}
      onOk={form.submit}
      okButtonProps={{ loading: isFetching, disabled: isFetching }}
      onCancel={handleCancel}
      cancelButtonProps={{
        disabled: isFetching,
      }}
      closable={!isFetching}
      maskClosable={!isFetching}
    >
      <Form form={form} onFinish={handleOk} layout="vertical">
        <FormPassword label="Current Passowrd" name="currentPassword" />
        <FormPassword label="New Passowrd" name="newPassword" />
        <FormConfirmPassword label="Confirm Password" name="confirmPassword" compareFieldName="newPassword" />
      </Form>
    </Modal>
  );
}
