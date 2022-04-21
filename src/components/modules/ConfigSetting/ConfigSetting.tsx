import React from 'react';
import { css } from '@emotion/react';
import HostDBSetting from './HostDBSetting';
import SitesSetting from './SitesSetting';
import styled from '@emotion/styled';
import { Row } from 'antd';

export type ConfigSettingProps = {};

export default function ConfigSetting({}: ConfigSettingProps): JSX.Element {
  return (
    <div css={style}>
      {/* <HostDBSection>
        <HostDBSetting />
      </HostDBSection> */}
      <SiteSection>
        <SitesSetting />
      </SiteSection>
    </div>
  );
}

const style = css``;

const HostDBSection = styled(Row)``;
const SiteSection = styled(Row)`
  /* margin-top: 2rem; */
`;
