import { css } from '@emotion/react';
import React from 'react';
import AccountTable from '../../components/modules/Account/AccountTable';

export type AccountProps = {
  children?: React.ReactNode;
};

export default function Account({ children }: AccountProps) {
  return (
    <div css={style}>
      <AccountTable />
    </div>
  );
}

const style = css`
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
`;
