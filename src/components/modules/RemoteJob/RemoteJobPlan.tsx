import { DesktopOutlined, ProfileOutlined, PushpinOutlined, ReloadOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Button, Input, Select, Space } from 'antd';
import React from 'react';
import { useRemotePlan } from '../../../hooks/remoteJob/useRemoteJobPlan';
import { NAME_MAX_LENGTH } from '../../../lib/constants';
import { RemoteJobType } from '../../../pages/Status/Remote/Remote';
import RemoteJobPlanTable from './RemoteJobPlanTable';
export type RemoteJobPlanProps = {
  type: RemoteJobType;
};

export default function RemoteJobPlan({ type }: RemoteJobPlanProps): JSX.Element {
  const {
    selectJob,
    selectSiteInfo,
    setSeleteSiteInfo,
    setJobName,
    siteList,
    isFetchingSiteList,
    refreshSiteList,
    plans,
    setSelectPlanIds,
    isFetchingPlans,
    refreshPlans,
  } = useRemotePlan();

  return (
    <div css={style}>
      <div className="job-name">
        <Space css={spaceStyle}>
          <PushpinOutlined />
          <span>Job Name</span>
        </Space>
        <Input
          placeholder="Input a job name"
          maxLength={NAME_MAX_LENGTH}
          value={selectJob.jobName ?? undefined}
          onChange={setJobName}
        />
      </div>
      <div className="user-fabName">
        <Space css={spaceStyle}>
          <DesktopOutlined />
          <span>User-Fab Name</span>
        </Space>
        <Select
          showSearch
          labelInValue
          css={selectStyle}
          value={selectSiteInfo ?? undefined}
          placeholder="Select a user-fab"
          onSelect={setSeleteSiteInfo}
          loading={isFetchingSiteList}
          disabled={isFetchingSiteList || type === 'edit'}
          optionFilterProp="children"
          filterOption={(input, option) => option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {siteList?.map((item) => (
            <Select.Option key={item.siteId} value={item.siteId} label={item.crasCompanyFabName}>
              {item.crasCompanyFabName}
            </Select.Option>
          ))}
        </Select>

        {type === 'add' && (
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            css={btnStyle}
            onClick={refreshSiteList}
            loading={isFetchingSiteList}
            disabled={isFetchingSiteList}
          />
        )}
      </div>
      <div className="select-plans">
        <Space css={spaceStyle}>
          <ProfileOutlined />
          <span>Plans</span>
        </Space>
        <RemoteJobPlanTable
          plans={plans}
          selectPlanIds={selectJob.planIds}
          setSelectPlanIds={setSelectPlanIds}
          isFetchingPlans={isFetchingPlans}
          refreshPlans={refreshPlans}
          selectSiteInfo={selectSiteInfo}
        />
        {refreshPlans}
      </div>
    </div>
  );
}

const style = css`
  font-size: 1rem;
  flex-wrap: nowrap;
  display: flex;
  flex-direction: column;

  .job-name {
    display: inherit;
    .ant-input {
      width: 33.75rem;
      font-size: 1rem;
    }
  }

  .user-fabName {
    display: inherit;
    font-size: 1rem;
    margin-top: 2rem;
    flex-wrap: nowrap;
  }

  .select-plans {
    display: inherit;
    font-size: 1rem;
    margin-top: 2rem;
    flex-wrap: nowrap;
    flex-direction: column;
  }
`;

const spaceStyle = css`
  width: 13.25rem;
  margin-bottom: 0.5rem;
`;

const selectStyle = css`
  width: 33.75rem;
  text-align: center;
  font-size: inherit;
`;

const btnStyle = css`
  border-radius: 0.625rem;
  margin-left: 0.5rem;
`;
