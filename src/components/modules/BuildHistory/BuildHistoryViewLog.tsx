import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Radio } from 'antd';
import Space from 'antd/lib/space';
import React from 'react';
import { LazyLog } from 'react-lazylog';
import { undraw_selection } from '../../../assets/images';
import useBuildHistoryViewLog from '../../../hooks/useBuildHistoryViewLog';
import { JobStatusType } from '../../../types/Job';
import { H_SPACE } from '../../atoms/Space';

export type BuildHistoryViewLogProps = {};

export default function BuildHistoryViewLog({}: BuildHistoryViewLogProps): JSX.Element {
  const { requestUrl, status, name, serverType, onChangeServerType } = useBuildHistoryViewLog();

  if (!requestUrl) {
    return (
      <InitialScreen>
        <img alt="select a log history" src={undraw_selection} />
        <div className="text">Please select a log history.</div>
      </InitialScreen>
    );
  }

  return (
    <div css={logViewStyle(status)}>
      <div className="title-section">
        <Space>
          <div>{status && <span className="status">●</span>}</div>
          <div>{name && <span className="name">{name}</span>}</div>
          <H_SPACE />
          <div>
            <Radio.Group value={serverType} onChange={onChangeServerType}>
              <Radio value={'logmonitor'}>Log Moniter Server</Radio>
              <Radio value={'cras'}>Cras Server</Radio>
            </Radio.Group>
          </div>
        </Space>
      </div>
      {serverType === 'logmonitor' ? (
        <LazyLog
          extraLines={1}
          enableSearch
          url={requestUrl + '/logmonitor'}
          caseInsensitive
          fetchOptions={{ credentials: 'include' }}
        />
      ) : (
        <LazyLog
          extraLines={1}
          enableSearch
          url={requestUrl + '/cras'}
          caseInsensitive
          fetchOptions={{ credentials: 'include' }}
        />
      )}
    </div>
  );
}

const InitialScreen = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 0.25rem;
  margin-left: 1rem;
  width: 71.4375rem;
  height: 47.34375rem;
  .img {
    width: 25rem;
    height: auto;
  }
  .text {
    padding-top: 1rem;
    font-size: 2rem;
  }
`;

const logViewStyle = (status: JobStatusType | null) => css`
  margin-top: 0.25rem;
  margin-left: 1rem;
  width: 71.4375rem;
  height: 47.34375rem;
  .title-section {
    height: 1.875rem;
  }
  .status {
    color: ${status && getColor(status)};
  }

  .ant-radio-group {
    display: flex;
    .ant-radio-wrapper {
      display: flex;
      align-items: center;
    }
  }
`;

function getColor(status: JobStatusType) {
  switch (status) {
    case 'success':
    case 'nodata':
      return '#52c41a';
    case 'failure':
      return '#ff4d4f';
    case 'notbuild':
      return '#d9d9d9';
    case 'processing':
      return '#1890ff';
    case 'canceled':
      return '#faad14';
    default:
      return undefined;
  }
}
