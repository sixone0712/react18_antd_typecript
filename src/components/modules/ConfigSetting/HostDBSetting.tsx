import { DatabaseOutlined, ReloadOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Descriptions, Row } from 'antd';
import React from 'react';
import { useHostDBinfo } from '../../../hooks/useHostDBinfo';
import ConfigTitle from './ConfigTitle';
export type HostDBSettingProps = {};

export default function HostDBSetting({}: HostDBSettingProps): JSX.Element {
  const { data, isFetching, refreshHostDBinfo } = useHostDBinfo();

  return (
    <DbInfo>
      <ConfigTitle
        icon={<DatabaseOutlined />}
        title="Settings Database Information"
        firstBtnProps={{
          icon: <ReloadOutlined />,
          action: refreshHostDBinfo,
          disabled: isFetching,
          loading: isFetching,
        }}
      />
      <DBInfoSection css={descriptionsStyle}>
        <Descriptions
          bordered
          column={4}
          size="small"
          contentStyle={{ textAlign: 'center' }}
          labelStyle={{ textAlign: 'center' }}
        >
          <Descriptions.Item label="IP Address">{data?.address || data?.address || '-'}</Descriptions.Item>
          <Descriptions.Item label="Port">{data?.port || '-'}</Descriptions.Item>
          <Descriptions.Item label="User">{data?.user || '-'}</Descriptions.Item>
        </Descriptions>
      </DBInfoSection>
    </DbInfo>
  );
}

const DbInfo = styled(Row)`
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 0.5rem;
  flex-direction: column;
  width: 100%;
`;

const DBInfoSection = styled(Row)``;

const descriptionsStyle = css`
  margin-left: 0.8rem;
  margin-right: 0.8rem;
  margin-top: 0.8rem;
  .ant-descriptions-item-label {
    /* width: 10.4375rem; */
    width: 13.917rem;
  }
  .ant-descriptions-item-content {
    /* width: 10.4375rem; */
    width: 13.917rem;
  }
`;
