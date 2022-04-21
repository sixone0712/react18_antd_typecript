import { Form, Modal } from 'antd';
import React from 'react';
import useAddUser from '../../../hooks/useAccountAddUser';
import FormConfirmPassword from '../../atoms/CustomForm/FormConfirmPassword';
import FormName from '../../atoms/CustomForm/FormName';
import FormPassword from '../../atoms/CustomForm/FormPassword';
import Permission from '../../atoms/Permission';

export type AccountAddUserProps = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AccountAddUser({ visible, setVisible }: AccountAddUserProps): JSX.Element {
  const { localRules, setLocalRules, loggedInUser, form, handleOk, handleCancel, isFetching } = useAddUser({
    visible,
    setVisible,
  });

  return (
    <Modal
      title="Add User"
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
      <Form form={form} onFinish={handleOk} onFinishFailed={() => {}} layout="vertical">
        <FormName label="User Name" name="username" />
        <FormPassword label="Passowrd" name="password" />
        <FormConfirmPassword label="Confirm Password" name="confirmPassword" />
      </Form>
      <div>Permission</div>
      <Permission rules={localRules} setRules={setLocalRules} loggedInUserRoles={loggedInUser.roles} />
    </Modal>
  );
}
