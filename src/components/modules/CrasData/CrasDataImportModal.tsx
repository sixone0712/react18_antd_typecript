import { InboxOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Modal, Space } from 'antd';
import Dragger from 'antd/lib/upload/Dragger';
import React from 'react';
import useCrasDataImport from '../../../hooks/useCrasDataImport';
import CustomIcon from '../../atoms/CustomIcon';

export default function CrasDataImportModal(): JSX.Element {
  const { visible, setVisible, importFile, setImportFile, handleOk, handleCancel, isImporting } = useCrasDataImport();

  const draggerProps = {
    name: 'file',
    multiple: false,
    maxCount: 1,
    beforeUpload: (file: File) => {
      setImportFile(file);
      return false;
    },
    onRemove: () => {
      setImportFile(undefined);
    },
  };

  return (
    <Modal
      title={'Import Cras Data'}
      visible={visible}
      onOk={handleOk}
      okButtonProps={{ loading: isImporting, disabled: isImporting || !importFile }}
      onCancel={handleCancel}
      cancelButtonProps={{
        disabled: isImporting,
      }}
      closable={!isImporting}
      maskClosable={!isImporting}
      destroyOnClose // TODO: 다른 방법이 있을까???
    >
      <>
        <div css={warningStyle}>
          <Space>
            <CustomIcon name="warning" />
            <div>All saved data will be deleted and replaced</div>
          </Space>
          <div>with data from the Import file.</div>
        </div>
        <Dragger {...draggerProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
        </Dragger>
      </>
    </Modal>
  );
}

const warningStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: red;
  font-size: 1rem;
  margin-bottom: 1rem;
`;
