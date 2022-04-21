import { Form, Modal } from 'antd';
import React from 'react';
import useAddressBookAddAddr from '../../../hooks/useAddressBookAddEditEmail';
import FormEmail from '../../atoms/CustomForm/FormEmail';
import FormName from '../../atoms/CustomForm/FormName';
import FormSelectMultiple from '../../atoms/CustomForm/FormSelectMultiple';

export default function AddressBookAddEditEmail(): JSX.Element {
  const {
    form,
    handleOk,
    handleCancel,
    isFetchingAddEditEmail,
    groupList,
    visible,
    editEmail,
    isFetchingGroups,
  } = useAddressBookAddAddr();

  return (
    <Modal
      title={editEmail ? 'Edit Address' : 'Add Address'}
      visible={visible}
      onOk={form.submit}
      okButtonProps={{ loading: isFetchingAddEditEmail, disabled: isFetchingAddEditEmail }}
      onCancel={handleCancel}
      cancelButtonProps={{
        disabled: isFetchingAddEditEmail,
      }}
      closable={!isFetchingAddEditEmail}
      maskClosable={!isFetchingAddEditEmail}
    >
      <Form form={form} onFinish={handleOk} layout="vertical">
        <FormName label="Name" name="name" isMultilingual disabled={isFetchingGroups || isFetchingAddEditEmail} />
        <FormEmail label="E-mail" name="email" disabled={isFetchingGroups || isFetchingAddEditEmail} />
        <FormSelectMultiple
          label="Group"
          name="groupIds"
          options={groupList}
          ObjkeyName="id"
          ObjvalueName="id"
          ObjLabelName="name"
          disabled={isFetchingGroups || isFetchingAddEditEmail}
          loading={isFetchingGroups}
          mode="multiple"
          required={false}
        />
      </Form>
    </Modal>
  );
}
