import { blue, green, grey, red } from '@ant-design/colors';
import { css } from '@emotion/react';
import { Space } from 'antd';
import React from 'react';
import { JobStatusType } from '../../../types/Job';
import CustomIcon from '../CustomIcon';

export type StatusItemProps = {
  status: JobStatusType;
  onClick?: () => void;
};

export default function StatusItem({ status, onClick }: StatusItemProps): JSX.Element {
  return (
    <div onClick={onClick}>
      <Space>
        <CustomIcon name="circle" css={statusIconStyle(status)} />
        <span css={statusTextStyle}>{status}</span>
      </Space>
    </div>
  );
}

const statusIconStyle = (status: JobStatusType) => {
  let color = grey[4];
  if (status === 'success') color = green[5];
  else if (status === 'failure') color = red[4];
  return css`
    color: ${color};
  `;
};

const statusTextStyle = css`
  text-decoration: underline;
  &:hover {
    color: ${blue[4]};
  }
  &:active {
    color: ${blue[6]};
  }
`;
