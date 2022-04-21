import { FormInstance, Modal, Transfer } from 'antd';
import React from 'react';
import { FormRemoteJobStepsDrawer } from '../../../../hooks/remoteJob/useRemoteJobStepsDrawer';
import useRemoteJobStepsModalRules from '../../../../hooks/remoteJob/useRemoteJobStepsModalRules';
import { TransferRemoteJobJudgeRule } from '../../../../types/Job';

export type RemoteJobStepsModalRules = {
  form: FormInstance<FormRemoteJobStepsDrawer>;
};
export default function RemoteJobStepsModalRules({ form }: RemoteJobStepsModalRules): JSX.Element {
  const {
    visible,
    data,
    targetKeys,
    selectedKeys,
    handleOk,
    handleCancel,
    handleChange,
    handleSelectChange,
  } = useRemoteJobStepsModalRules({ form });

  const filterOption = (inputValue: string, item: TransferRemoteJobJudgeRule) =>
    item.itemName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;

  return (
    <Modal
      title={'Edit Select Judge Rules'}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      // cancelButtonProps={{
      //   disabled: isFetchingAddEdit,
      // }}
      // closable={!isFetchingAddEdit}
      // maskClosable={!isFetchingAddEdit}
      width={'1000px'}
    >
      <Transfer<TransferRemoteJobJudgeRule>
        dataSource={data}
        titles={['All Enable Judge Rules', 'Selected Judge Rules']}
        showSearch
        listStyle={{
          width: 500,
          height: 500,
        }}
        targetKeys={targetKeys}
        onChange={handleChange}
        render={(item) => item.itemName}
        filterOption={filterOption}
        onSelectChange={handleSelectChange}
        selectedKeys={selectedKeys}
      />
    </Modal>
  );
}
