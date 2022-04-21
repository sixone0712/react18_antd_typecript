import { Modal } from 'antd';
import React from 'react';
import useAccountEditPermission from '../../../hooks/useAccountEditPermission';
import { UserRolesBoolean } from '../../../reducers/slices/loginUser';
import Permission from '../../atoms/Permission';

export type AccountPermissionProps = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  id: number;
  rules: UserRolesBoolean;
  onRefresh: () => void;
};

export default function AccountEditPermission({ visible, setVisible, id, rules }: AccountPermissionProps): JSX.Element {
  const { localRules, setLocalRules, loggedInUser, handleOk, handleCancel, isFetching } = useAccountEditPermission({
    visible,
    setVisible,
    id,
    rules,
  });

  return (
    <Modal
      title="Change Permission"
      visible={visible}
      onOk={handleOk}
      okButtonProps={{ loading: isFetching, disabled: isFetching }}
      onCancel={handleCancel}
      cancelButtonProps={{
        disabled: isFetching,
      }}
      closable={!isFetching}
      maskClosable={!isFetching}
    >
      <Permission rules={localRules} setRules={setLocalRules} loggedInUserRoles={loggedInUser.roles} />
    </Modal>
  );
}
