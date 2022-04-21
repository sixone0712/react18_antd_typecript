import { css } from '@emotion/react';
import { PageHeader, Popconfirm, Space } from 'antd';
import React, { useMemo } from 'react';
import useRemoteJobStatusStep from '../../../hooks/remoteJobStatus/useRemoteJobStatusStep';
import CustomIcon from '../../atoms/CustomIcon';
import { H_SPACE } from '../../atoms/Space';
import RemoteJobStatusStepBuild from './RemoteJobStatusStepBuild';
import RemoteJobStatusStepList from './RemoteJobStatusStepList';
export type RemoteJobStatusStepProps = {};

export default function RemoteJobStatusStep({}: RemoteJobStatusStepProps): JSX.Element {
  const { name, status, onBack, onClickStartStop, loggedInUser } = useRemoteJobStatusStep();
  const title = useMemo(() => {
    const isStop = status?.stop;

    if (isStop === undefined) {
      <Space>
        <div>Remote Job Step Status</div>
        <div>|</div>
        <Space css={statusIconStyle}>
          <CustomIcon className="unknown" name="stop" />
          <span>{name}</span>
        </Space>
      </Space>;
    }

    return (
      <Space>
        <div>Remote Job Step Status</div>
        <div>|</div>
        <Space css={statusIconStyle}>
          <Popconfirm
            title={`Are you sure to ${isStop ? 'start' : 'stop'} job?`}
            okText="Ok"
            okButtonProps={{ type: 'primary', disabled: !loggedInUser.roles.isRoleJob }}
            onConfirm={onClickStartStop}
          >
            <CustomIcon className={isStop ? 'stopped' : 'running'} name={isStop ? 'stop' : 'play'} />
          </Popconfirm>
          <span>{name}</span>
        </Space>
      </Space>
    );
  }, [status, name, onClickStartStop, loggedInUser]);

  return (
    <div css={style}>
      <PageHeader
        onBack={onBack}
        title={title}
        css={css`
          padding-left: 0.5rem;
        `}
      />
      <div className="container">
        <RemoteJobStatusStepBuild />
        <H_SPACE />
        <RemoteJobStatusStepList />
      </div>
    </div>
  );
}

const style = css`
  width: 86rem;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  display: flex;
  flex-direction: column;
  .container {
    display: flex;
    flex-direction: row;
  }
`;

const statusIconStyle = css`
  .running {
    color: #52c41a;
    -webkit-animation: blink 1s ease-in-out infinite alternate;
    animation: blink 1s ease-in-out infinite alternate;
    @keyframes blink {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
  }

  .stopped {
    color: #ff4d4f;
  }

  .unknown {
    color: #b3b3b3;
  }
`;
