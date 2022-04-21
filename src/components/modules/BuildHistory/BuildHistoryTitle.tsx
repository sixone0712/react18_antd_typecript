import { blue } from '@ant-design/colors';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Space } from 'antd';
import queryString from 'query-string';
import React, { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

export type BuildHistoryTitleProps = {};

export default function BuildHistoryTitle({}: BuildHistoryTitleProps): JSX.Element {
  const { search } = useLocation();
  const { stepName, jobName } = queryString.parse(search);
  const history = useHistory();

  const onBack = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <div css={style}>
      <Space size={14}>
        <ArrowLeftOutlined className="icon" onClick={onBack} />
        <span className="menu-name">Build Hisory</span>
        {jobName && (
          <span className="site-name">
            <span title={`Job Name : ${jobName}`}>{jobName}</span>
            <span> | </span>
            <span title={`Step Name : ${stepName}`}>{stepName}</span>
          </span>
        )}
      </Space>
    </div>
  );
}

const style = css`
  margin-left: 0.5rem;
  margin-bottom: 0.5rem;
  .icon,
  .menu-name {
    font-size: 1.25rem;
  }
  .menu-name {
    font-weight: 700;
  }
  .site-name {
    font-size: 0.9rem;
    color: gray;
  }
  .ant-space-item {
    display: flex;
  }
  &:hover {
    .icon {
      color: ${blue[4]};
    }
  }
  &:active {
    .icon {
      color: ${blue[6]};
    }
  }
`;
