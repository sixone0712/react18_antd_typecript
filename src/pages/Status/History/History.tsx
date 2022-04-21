import { css } from '@emotion/react';
import React from 'react';
import BuildHistory from '../../../components/modules/BuildHistory';
export type HistoryProps = {};

export default function History({}: HistoryProps): JSX.Element {
  return (
    <div css={style}>
      <BuildHistory />
    </div>
  );
}

const style = css`
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
`;
