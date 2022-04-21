import { Form, Modal, Transfer } from 'antd';
import React from 'react';
import useAddressBookAddEditGroup from '../../../hooks/useAddressBookAddEditGroup';
import { AddressInfo } from '../../../lib/api/axios/types';
import FormName from '../../atoms/CustomForm/FormName';

export default function AddressBookAddEditGroup(): JSX.Element {
  const {
    form,
    handleOk,
    handleCancel,
    addressList,
    targetKeys,
    handleChange,
    editGroup,
    isFetchingQuery,
    isFetchingAddEdit,
    selectedKeys,
    handleSelectChange,
    visible,
  } = useAddressBookAddEditGroup();

  const filterOption = (inputValue: string, item: AddressInfo) =>
    item.name.indexOf(inputValue) > -1 || item.email.indexOf(inputValue) > -1;

  return (
    <Modal
      title={editGroup ? 'Edit Group' : 'Add Group'}
      visible={visible}
      onOk={form.submit}
      okButtonProps={{ loading: isFetchingAddEdit, disabled: isFetchingAddEdit }}
      onCancel={handleCancel}
      cancelButtonProps={{
        disabled: isFetchingAddEdit,
      }}
      closable={!isFetchingAddEdit}
      maskClosable={!isFetchingAddEdit}
      width={'1000px'}
      destroyOnClose // TODO: 다른 방법은 없을까?
    >
      <Form form={form} onFinish={handleOk} layout="vertical">
        <FormName label="Name" name="name" isMultilingual disabled={isFetchingQuery || isFetchingAddEdit} />
        <Form.Item label="Group Member" name="emailIds">
          <Transfer<AddressInfo>
            dataSource={isFetchingQuery ? [] : addressList}
            titles={['All Emails', 'Group Members']}
            showSearch
            listStyle={{
              width: 500,
              height: 500,
            }}
            targetKeys={isFetchingQuery ? [] : targetKeys}
            onChange={handleChange}
            render={(item) => `${item.name} <${item.email}>`}
            filterOption={filterOption}
            disabled={isFetchingQuery || isFetchingAddEdit}
            onSelectChange={handleSelectChange}
            selectedKeys={selectedKeys}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
