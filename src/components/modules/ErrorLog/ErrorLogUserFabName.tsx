import { ReloadOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Badge, Button, Select } from 'antd';
import React from 'react';
import useErrorLogUserFabName from '../../../hooks/errorLog/useErrorLogUserFabName';

export type ErrorLogUserFabNameProps = {};

export default React.memo(function ErrorLogUserFabName({}: ErrorLogUserFabNameProps): JSX.Element {
  const {
    siteList,
    isFetchingSiteList,
    refreshSiteList,
    selectSiteInfo,
    onChangeSiteInfo,
    onClearSiteInfo,
  } = useErrorLogUserFabName();
  return (
    <div css={style}>
      <div className="user-fab-title">
        <Badge color="blue" />
        <span>User-Fab Name</span>
      </div>
      <div className="user-fab-select">
        <Select
          showSearch
          labelInValue
          css={selectStyle}
          value={selectSiteInfo ?? undefined}
          placeholder="Select a user-fab"
          onSelect={onChangeSiteInfo}
          loading={isFetchingSiteList}
          optionFilterProp="children"
          filterOption={(input, option) => option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          allowClear
          onClear={onClearSiteInfo}
        >
          {siteList?.map((item) => (
            <Select.Option key={item.siteId} value={item.siteId} label={item.crasCompanyFabName}>
              {item.crasCompanyFabName}
            </Select.Option>
          ))}
        </Select>
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          css={btnStyle}
          onClick={refreshSiteList}
          loading={isFetchingSiteList}
          disabled={isFetchingSiteList}
        />
      </div>
    </div>
  );
});

const style = css`
  display: flex;
  flex-direction: column;
  .user-fab-title {
    width: 10rem;
  }
  .user-fab-select {
    padding-left: 1rem;
    margin-top: 1rem;
    display: flex;
    flex-direction: row;
  }
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
