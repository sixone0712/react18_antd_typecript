import { css } from '@emotion/react';
import React from 'react';
import AccountTable from './AccountTable';

export type AccountProps = {};

export default function Account({}: AccountProps): JSX.Element {
  return (
    <div css={style}>
      <AccountTable />
    </div>
  );
}

const style = css``;
