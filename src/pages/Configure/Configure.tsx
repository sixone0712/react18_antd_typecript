import { css } from '@emotion/react';
import React from 'react';
import ConfigSetting from '../../components/modules/ConfigSetting';

export type ConfigureProps = {
  children?: React.ReactNode;
};

export default function Configure({ children }: ConfigureProps) {
  return (
    <div css={style}>
      <ConfigSetting />
    </div>
  );
}

const style = css``;
