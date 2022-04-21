import { EditOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Button, Form, FormInstance } from 'antd';
import React from 'react';
import { FormRemoteJobStepsDrawer } from '../../../../hooks/remoteJob/useRemoteJobStepsDrawer';
import useRemoteJobStepsDrawerRules from '../../../../hooks/remoteJob/useRemoteJobStepsDrawerRules';
import { H_SPACE } from '../../../atoms/Space';
import RemoteJobStepsModalRules from '../Modal/RemoteJobStepsModalRules';
import { StepCommonLabel } from './RemoteJobStepsDrawerCommon';

export type RemoteJobStepsDrawerRulesProps = {
  form: FormInstance<FormRemoteJobStepsDrawer>;
};

export default function RemoteJobStepsDrawerRules({ form }: RemoteJobStepsDrawerRulesProps): JSX.Element {
  const { totalRules, curRules, onOpenEditModal } = useRemoteJobStepsDrawerRules({ form });
  return (
    <div css={style}>
      <Form.Item
        label={<StepCommonLabel label="Select Judge Rules" />}
        className="selectJudgeRules"
        name="selectJudgeRules"
        colon={false}
      >
        <div className="rules">
          <div>{`${curRules?.length ?? 0} / ${totalRules?.length ?? 0} Rules`}</div>
          <H_SPACE rem={2} />
          <Button
            type="dashed"
            icon={<EditOutlined />}
            onClick={onOpenEditModal}
            css={css`
              border-radius: 0.625rem;
            `}
          >
            Edit
          </Button>
        </div>
      </Form.Item>
      <RemoteJobStepsModalRules form={form} />
    </div>
  );
}

const style = css`
  .rules {
    display: flex;
    align-items: center;
  }
`;
