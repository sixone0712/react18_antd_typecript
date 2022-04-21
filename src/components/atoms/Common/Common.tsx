import { css, SerializedStyles } from '@emotion/react';
import { Empty, Result } from 'antd';
import React from 'react';
export function CommonTableEmpty({
  isError,
  size = 'large',
}: {
  isError: boolean;
  size?: 'small' | 'large';
}): JSX.Element {
  return isError ? (
    <Result css={commonTableEmptyStyle({ size })} title="Failed to response data" status="warning" />
  ) : (
    <Empty description="No Data" />
  );
}

const commonTableEmptyStyle = ({ size }: { size: 'small' | 'large' }) => css`
  ${size === 'small' &&
  css`
    .ant-result-icon {
      .anticon {
        font-size: 2rem;
      }
    }
    .ant-result-title {
      font-size: 1rem;
    }
  `}
`;

export const ellipsisLineStyle = ({ line = 0 }: { line?: number }): SerializedStyles => css`
  ${line > 0 &&
  css`
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: ${line};
    -webkit-box-orient: vertical;
  `}
`;
