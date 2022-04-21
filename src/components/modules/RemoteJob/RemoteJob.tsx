import { FileSyncOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { PageHeader, Space } from 'antd';
import React from 'react';
import { useRemoteJob } from '../../../hooks/remoteJob/useRemoteJob';
import { RemoteJobType, REMOTE_JOB_STEP } from '../../../types/Job';
import CustomIcon from '../../atoms/CustomIcon';
import SideSteps from '../../atoms/SideSteps';
import StepButton from '../../atoms/StepButton';
import RemoteJobCheck from './RemoteJobCheck';
import RemoteJobPlan from './RemoteJobPlan';
import RemoteJobSteps from './RemoteJobSteps';
export interface RemoteJobProps {
  type: RemoteJobType;
}

export default function RemoteJob({ type }: RemoteJobProps): JSX.Element {
  const { current, setCurrent, onBack, onNextAction, disabledNext } = useRemoteJob({ type });

  return (
    <div css={style}>
      <PageHeader onBack={onBack} title={`${type === 'add' ? 'Add' : 'Edit'} Remote Job Setting`} />
      <div className="layout">
        <div className="sider">
          <SideSteps current={current} stepList={remoteJobStepList} />
        </div>
        <div className="content">
          <div className="prev-next">
            <RemoteTitle current={current} />
            <StepButton
              current={current}
              setCurrent={setCurrent}
              lastStep={REMOTE_JOB_STEP.CHECK}
              nextActionPromise={onNextAction}
              type={type}
              disabled={disabledNext}
            />
          </div>
          <div className="setting">
            {current === REMOTE_JOB_STEP.PLANS && <RemoteJobPlan type={type} />}
            {current === REMOTE_JOB_STEP.STEPS && <RemoteJobSteps />}
            {current === REMOTE_JOB_STEP.CHECK && <RemoteJobCheck />}
          </div>
        </div>
      </div>
    </div>
  );
}

const remoteJobStepList = ['Plans', 'Steps', 'Check'];
const RemoteTitle = React.memo(function RemoteTitleMemo({ current }: { current: number }) {
  return (
    {
      [REMOTE_JOB_STEP.PLANS]: (
        <Space>
          <CustomIcon name="plans_setting" />
          <span>Plans</span>
        </Space>
      ),
      [REMOTE_JOB_STEP.STEPS]: (
        <Space>
          <FileSyncOutlined />
          <span>Steps</span>
        </Space>
      ),
      [REMOTE_JOB_STEP.CHECK]: (
        <Space>
          <CustomIcon name="check_setting" />
          <span>Check</span>
        </Space>
      ),
    }[current] ?? <></>
  );
});

const style = css`
  display: flex;
  flex-direction: column;
  background-color: white;
  width: inherit;

  .layout {
    display: flex;
    width: 87rem;
    padding-left: 1.75rem;
    padding-right: 1.75rem;
    margin-top: 1.875rem;
    flex-wrap: nowrap;

    .content {
      display: inherit;
      flex-direction: column;
      width: 66.6875rem;

      .prev-next {
        display: inherit;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-left: 1rem;
        font-size: 1.125rem;
      }

      .setting {
        padding-top: 2.125rem;
        margin-left: 3rem;
      }
    }
  }
`;
