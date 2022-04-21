import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Badge, Form, FormInstance, Input, Space, Switch } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormRemoteJobStepsDrawer } from '../../../../hooks/remoteJob/useRemoteJobStepsDrawer';
import { NAME_MAX_LENGTH } from '../../../../lib/constants';
import { JobStepType } from '../../../../types/Job';

export default function RemoteJobStepsDrawerCommon({ form }: { form: FormInstance<FormRemoteJobStepsDrawer> }) {
  const [stepType, setStepType] = useState<string>('');
  useEffect(() => {
    const type = form.getFieldValue('stepType') as JobStepType;
    setStepType(convertStepType(type));
  }, []);

  return (
    <>
      <Form.Item label={<StepCommonLabel label="Enable" />} name="enable" valuePropName="checked" colon={false}>
        <Switch />
      </Form.Item>
      <Form.Item label={<StepCommonLabel label="Step Type" />} name="stepType" colon={false}>
        <div>{stepType}</div>
      </Form.Item>
      <Form.Item
        label={<StepCommonLabel label="Step Name" />}
        name="stepName"
        rules={[{ required: true, message: 'Please input a step name!' }]}
        colon={false}
      >
        <Input maxLength={NAME_MAX_LENGTH} />
      </Form.Item>
      <Form.Item label={<StepCommonLabel label="Description" />} name="description" colon={false}>
        <Input />
      </Form.Item>
      <Form.Item name="type" hidden />
      <Form.Item name="uuid" hidden />
      <Form.Item name="stepId" hidden />
    </>
  );
}

export const StepEmptyLable = styled.div`
  width: 10rem;
`;

export function StepCommonLabel({ label, depth = 0 }: { label: string; depth?: number }): JSX.Element {
  return (
    <Space
      css={css`
        width: 10rem;
        padding: ${depth !== 0 && '1rem'};
      `}
    >
      <Badge color={depth === 0 ? 'blue' : 'green'} />
      <div>{label}</div>
    </Space>
  );
}

export function StepSwitchLabel({
  label,
  checked,
  onClick,
  depth = 0,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
  depth?: number;
}): JSX.Element {
  return (
    <Space
      css={css`
        width: 10rem;
        padding: ${depth !== 0 && '1rem'};
      `}
    >
      <Badge color={depth === 0 ? 'blue' : 'green'} />
      <div>{label}</div>
      <Switch checkedChildren="On" unCheckedChildren="Off" checked={checked} onClick={() => onClick()} />
    </Space>
  );
}

export const convertStepType = (type: JobStepType): string =>
  ({
    ['collect']: 'Collect',
    ['convert']: 'Convert & Insert',
    ['summary']: 'Error Summary',
    ['cras']: 'Cras Data',
    ['version']: 'MPA Version Check',
    ['purge']: 'Database Purge',
    ['notice']: 'Error Notification',
    ['custom']: 'Custom',
  }[type] ?? '');
