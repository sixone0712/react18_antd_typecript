import { css } from '@emotion/react';
import React from 'react';
import BuildHistoryMenu from './BuildHistoryMenu';
import BuildHistoryTitle from './BuildHistoryTitle';
import BuildHistoryViewLog from './BuildHistoryViewLog';
export type BuildHistoryProps = {};

export default function BuildHistory({}: BuildHistoryProps): JSX.Element {
  return (
    <div css={containerStyle}>
      <BuildHistoryTitle />
      <div css={sectionStyle}>
        <BuildHistoryMenu />
        <BuildHistoryViewLog />
      </div>
    </div>
  );
}

const containerStyle = css`
  display: flex;
  flex-direction: column;
`;

const sectionStyle = css`
  display: flex;
  flex-direction: row;
  border: 1px solid #f0f0f0;
`;
