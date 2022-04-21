import { InboxOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Modal, Space } from 'antd';
import Dragger from 'antd/lib/upload/Dragger';
import React, { useCallback, useEffect, useState } from 'react';
import CustomIcon from '../../../atoms/CustomIcon';

export default function RemoteJobStepsModalScriptImport({
  visible,
  setVisible,
  onChangeScript,
}: {
  visible: boolean;
  setVisible: (isImportScript: boolean) => void;
  onChangeScript: (script: string | null) => void;
}): JSX.Element {
  const [importFile, setImportFile] = useState<File | undefined>(undefined);

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

  const handleOk = useCallback(() => {
    const fileReader = new FileReader();
    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      onChangeScript((e.target?.result as string) ?? null);
    };
    fileReader.readAsText(importFile as Blob);
    setVisible(false);
  }, [onChangeScript, importFile, setVisible]);

  const handleCancel = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  useEffect(() => {
    if (visible) {
      setImportFile(undefined);
    }
  }, [visible]);

  return (
    <Modal
      title={'Import Script File'}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      closable
      maskClosable
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
