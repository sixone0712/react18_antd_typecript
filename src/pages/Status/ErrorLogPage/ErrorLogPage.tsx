import { css } from '@emotion/react';
import React from 'react';
import ErrorLog from '../../../components/modules/ErrorLog';

export type ErrorLogPageProps = {};

export default function ErrorLogPage({}: ErrorLogPageProps): JSX.Element {
  return (
    <div css={style}>
      <ErrorLog />
    </div>
  );
}

const style = css`
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
`;
