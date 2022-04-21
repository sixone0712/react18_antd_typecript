import { FormInstance, Modal, Transfer } from 'antd';
import React from 'react';
import { FormRemoteJobStepsDrawer } from '../../../../hooks/remoteJob/useRemoteJobStepsDrawer';
import useRemoteJobStepsModalAddrBook from '../../../../hooks/remoteJob/useRemoteJobStepsModalAddrBook';
import { TransferJobAddressInfo } from '../../../../types/address';

export type RemoteJobStepsModalAddrBookProps = {
  form: FormInstance<FormRemoteJobStepsDrawer>;
};
export default function RemoteJobStepsModalAddrBook({ form }: RemoteJobStepsModalAddrBookProps): JSX.Element {
  const {
    visible,
    addressList,
    isFetching,
    targetKeys,
    selectedKeys,
    handleOk,
    handleCancel,
    handleChange,
    handleSelectChange,
  } = useRemoteJobStepsModalAddrBook({ form });

  const filterOption = (inputValue: string, item: TransferJobAddressInfo) =>
    item.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1 ||
    item.email.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;

  return (
    <Modal
      title={'Address Book'}
      visible={visible}
      onOk={handleOk}
      okButtonProps={{ disabled: isFetching }}
      onCancel={handleCancel}
      // cancelButtonProps={{
      //   disabled: isFetchingAddEdit,
      // }}
      // closable={!isFetchingAddEdit}
      // maskClosable={!isFetchingAddEdit}
      width={'1000px'}
    >
      <Transfer<TransferJobAddressInfo>
        dataSource={isFetching ? [] : addressList}
        titles={['All Emails', 'Recipients']}
        showSearch
        listStyle={{
          width: 500,
          height: 500,
        }}
        targetKeys={isFetching ? [] : targetKeys}
        onChange={handleChange}
        render={(item) => item.label}
        filterOption={filterOption}
        disabled={isFetching}
        onSelectChange={handleSelectChange}
        selectedKeys={selectedKeys}
      />
    </Modal>
  );
}
