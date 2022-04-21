import { TagOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Badge, Space } from 'antd';
import React, { useMemo } from 'react';
import useRemoteJobStatusStepBuild from '../../../hooks/remoteJobStatus/useRemoteJobStatusStepBuild';
import { CommonTableEmpty } from '../../atoms/Common/Common';
import CustomBadgeSync from '../../atoms/CustomBadge/CustomBadgeSync';
import { V_SPACE } from '../../atoms/Space';
import { convertStepType } from '../RemoteJob/Drawer/RemoteJobStepsDrawerCommon';
export type RemoteJobStatusStepBuildProps = {};

export default function RemoteJobStatusStepBuild({}: RemoteJobStatusStepBuildProps): JSX.Element {
  const { queueData, executorData, isErrorQueue, isErrorExecutor } = useRemoteJobStatusStepBuild();

  const queueList = useMemo(() => {
    return isErrorQueue ? (
      <CommonTableEmpty isError={true} size="small" />
    ) : (
      queueData?.map((item) => (
        <div className="value" key={item.index}>
          <div className="time">
            <Space>
              <div>{`${item.date} / ${convertStepType(item.stepType)}`}</div>
              {item.manual && <TagOutlined />}
            </Space>
          </div>
          <div className="name" title={item.stepName}>
            {item.stepName}
          </div>
        </div>
      ))
    );
  }, [queueData, isErrorQueue]);

  const excutorList = useMemo(() => {
    return isErrorExecutor ? (
      <CommonTableEmpty isError={true} size="small" />
    ) : (
      executorData?.map((item) => (
        <div className="value" key={item.index}>
          <div className="time">
            <Space>
              <div>{`${item.date} / ${convertStepType(item.stepType)}`}</div>
              {item.manual && <TagOutlined />}
            </Space>
          </div>
          <div className="name" title={item.stepName}>
            {item.stepName}
          </div>
        </div>
      ))
    );
  }, [executorData, isErrorExecutor]);

  return (
    <div css={style}>
      <V_SPACE />
      <div className="queue">
        <div className="title">
          <Badge color="blue" />
          {/* <div>{`Build Queue (${queueData?.length ?? 0})`}</div> */}
          <div>{`Build Queue`}</div>
          <CustomBadgeSync size="1.25rem" color={isErrorQueue ? 'gray' : 'green'} marginLeft="0.5rem" />
        </div>
        <div className="description">{queueList}</div>
      </div>
      <V_SPACE rem={2} />
      <div className="excutor">
        <div className="title">
          <Badge color="blue" />
          <div>{`Build Executor Status (${executorData?.length ?? 0})`}</div>
          <CustomBadgeSync size="1.25rem" color={isErrorExecutor ? 'gray' : 'green'} marginLeft="0.5rem" />
        </div>
        <div className="description">{excutorList}</div>
      </div>
    </div>
  );
}

const style = css`
  display: flex;
  flex-direction: column;
  width: 21rem;

  .queue,
  .excutor {
    /* border: 1px solid #8c8c8c; */
    border: 1px solid #f0f0f0;
    border-radius: 3px;
    padding: 0.5rem;
    height: 22rem;
    overflow-x: hidden;
    overflow-y: auto;
    .title {
      display: flex;
      align-items: center;
      position: absolute;
      margin-top: -20px;
      background-color: white;
      padding-left: 0.5rem;
      padding-right: 0.5rem;
      font-size: 1;
      font-weight: 700;
    }
    .description {
      .value {
        display: flex;
        flex-direction: column;
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;

        .name {
          color: #979494;
          width: 18.875rem;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
    }
  }
`;
