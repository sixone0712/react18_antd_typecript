import { css } from '@emotion/react';
import { Form, FormInstance, InputNumber, Space } from 'antd';
import React from 'react';
import { FormRemoteJobStepsDrawer } from '../../../../hooks/remoteJob/useRemoteJobStepsDrawer';
import { EMAIL_BEFORE_MAX } from '../../../../lib/constants';
import { StepCommonLabel } from './RemoteJobStepsDrawerCommon';

export type RemoteJobStepsDrawerBeforeProps = {
  form: FormInstance<FormRemoteJobStepsDrawer>;
};

export default function RemoteJobStepsDrawerBefore({ form }: RemoteJobStepsDrawerBeforeProps): JSX.Element {
  return (
    <div css={styleBefore}>
      <Space>
        <Form.Item
          label={<StepCommonLabel label="Before" />}
          className="before"
          name="before"
          rules={[
            {
              required: true,
              message: `Please input a number between 1 to 999!`,
            },
          ]}
          colon={false}
        >
          <InputNumber
            min={1}
            max={EMAIL_BEFORE_MAX}
            formatter={(value) => {
              return value ? JSON.stringify(Math.floor(value)) : '';
            }}
            addonAfter="Days"
          />
        </Form.Item>
      </Space>
    </div>
  );
}

const styleBefore = css``;
