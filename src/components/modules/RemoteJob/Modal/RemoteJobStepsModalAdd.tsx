import { css } from '@emotion/react';
import { FormInstance, Modal, Radio, Space } from 'antd';
import React from 'react';
import { FormRemoteJobStepsDrawer } from '../../../../hooks/remoteJob/useRemoteJobStepsDrawer';
import useRemoteJobStepsModalAdd from '../../../../hooks/remoteJob/useRemoteJobStepsModalAdd';

export type RemoteJobStepsModalAddProps = {
  form: FormInstance<FormRemoteJobStepsDrawer>;
};

export default function RemoteJobStepsModalAdd({ form }: RemoteJobStepsModalAddProps): JSX.Element {
  const { visible, onNext, onCancel, stepType, setStepType } = useRemoteJobStepsModalAdd({ form });

  return (
    <Modal
      title={'Select Add Step Type'}
      visible={visible}
      onOk={onNext}
      onCancel={onCancel}
      okText="Next"
      okButtonProps={{
        disabled: stepType === null,
      }}
      closable
      maskClosable
      css={style}
      width={400}
    >
      <Radio.Group onChange={setStepType} value={stepType}>
        <Space direction="vertical">
          <Radio value="collect">Collect</Radio>
          <Radio value="convert">Convert & Insert</Radio>
          <Radio value="summary">Error Summary</Radio>
          <Radio value="cras">Cras Data</Radio>
          <Radio value="version">MPA Version Check</Radio>
          <Radio value="purge">Database Purge</Radio>
          <Radio value="notice">Error Notification</Radio>
          <Radio value="custom">Custom</Radio>
        </Space>
      </Radio.Group>
    </Modal>
  );
}

const style = css`
  .ant-radio-wrapper {
    .text {
      width: 8rem;
    }
  }

  .ant-select.value {
    width: 13rem;
  }
`;
