import styled from '@emotion/styled';
import { Row } from 'antd';
import React from 'react';
import SitesSettingAddEdit from './SitesSettingAddEdit';
import SitesSettingTable from './SitesSettingTable';

export type SitesSettingProps = {};

export default function SitesSetting({}: SitesSettingProps): JSX.Element {
  return (
    <SiteInfo>
      <SitesSettingTable />
      <SitesSettingAddEdit />
    </SiteInfo>
  );
}

const SiteInfo = styled(Row)`
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 0.5rem;
  flex-direction: column;
  width: 100%;
`;
