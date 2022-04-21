import { css } from '@emotion/react';
import { Button, Form, FormInstance, Select, Space } from 'antd';
import React from 'react';
import { FormRemoteJobStepsDrawer } from '../../../../hooks/remoteJob/useRemoteJobStepsDrawer';
import useRemoteJobStepsDrawerScript from '../../../../hooks/remoteJob/useRemoteJobStepsDrawerScript';
import RemoteJobStepsModalScript from '../Modal/RemoteJobStepsModalScript';
import RemoteJobStepsModalScriptImport from '../Modal/RemoteJobStepsModalScriptImport';
import { StepCommonLabel } from './RemoteJobStepsDrawerCommon';

export type RemoteJobStepsDrawerScriptProps = {
  form: FormInstance<FormRemoteJobStepsDrawer>;
};

export default function RemoteJobStepsDrawerScript({ form }: RemoteJobStepsDrawerScriptProps): JSX.Element {
  const {
    scriptType,
    setScriptType,
    script,
    setScript,
    isScript,
    setIsScript,
    onImport,
    onExport,
    isImportScript,
    setIsImportScript,
  } = useRemoteJobStepsDrawerScript({
    form,
  });
  return (
    <div css={style}>
      <Form.Item label={<StepCommonLabel label="Script" />} colon={false}>
        <Space>
          <Form.Item name="scriptType" className="script-type">
            <Select onChange={setScriptType}>
              <Select.Option value="python">Python</Select.Option>
              <Select.Option value="shell">Shell</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item className="script-btns">
            <Space>
              <Button onClick={() => setIsScript(true)}>Edit</Button>
              <Button onClick={() => onImport()}>Import</Button>
              <Button onClick={() => onExport()}>Export</Button>
            </Space>
          </Form.Item>
        </Space>
        {/* just for setting form value */}
        <Form.Item
          noStyle
          name="script"
          rules={[
            {
              required: true,
              message: 'Please input a script content!',
            },
          ]}
        />
      </Form.Item>
      <RemoteJobStepsModalScript
        type={scriptType}
        visible={isScript}
        setVisible={setIsScript}
        script={script}
        onChangeScript={setScript}
      />
      <RemoteJobStepsModalScriptImport
        visible={isImportScript}
        setVisible={setIsImportScript}
        onChangeScript={setScript}
      />
    </div>
  );
}

const style = css`
  .script-type {
    .ant-select {
      width: 6.25rem;
    }
  }

  .script-type,
  .script-btns {
    margin-bottom: 0.5rem;
  }
`;
