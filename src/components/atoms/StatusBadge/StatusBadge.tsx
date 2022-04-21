import { blue } from '@ant-design/colors';
import { css } from '@emotion/react';
import { Badge } from 'antd';
import { PresetStatusColorType } from 'antd/lib/_util/colors';
import React from 'react';
import { JobStatusType } from '../../../types/Job';

export type StatusBadgeProps = {
  jobType?: 'remote' | 'local';
  type: JobStatusType;
  onClick?: () => void;
};

export const converStatusType = (
  type: JobStatusType
): { badgeStatus: PresetStatusColorType | undefined; textStatus: string } => {
  switch (type) {
    case 'success':
      return {
        badgeStatus: 'success',
        textStatus: 'Success',
      };

    case 'failure':
      return {
        badgeStatus: 'error',
        textStatus: 'Failure',
      };
    case 'processing':
      return {
        badgeStatus: 'processing',
        textStatus: 'Processing',
      };
    case 'canceled':
      return {
        badgeStatus: 'warning',
        textStatus: 'Canceled',
      };
    case 'nodata':
      return {
        badgeStatus: 'success',
        textStatus: 'No Data',
      };

    case 'notbuild':
      return {
        badgeStatus: 'default',
        textStatus: 'Not Build',
      };

    default:
      return { badgeStatus: undefined, textStatus: 'Unknown' };
  }
};

export default function StatusBadge({ type, onClick, jobType = 'local' }: StatusBadgeProps): JSX.Element {
  const { badgeStatus, textStatus } = converStatusType(type);

  return (
    <div css={containerStyle(type, jobType)} onClick={onClick}>
      {badgeStatus ? (
        <Badge status={badgeStatus} text={textStatus} />
      ) : (
        <span className="ant-badge-status-text">{textStatus}</span>
      )}
    </div>
  );
}

const containerStyle = (type: JobStatusType, jobType: 'remote' | 'local') => css`
  ${jobType === 'local'
    ? css`
        pointer-events: ${!isContainerStyleHover(type) && 'none'};
        cursor: ${isContainerStyleHover(type) ? 'pointer' : 'default'};
        &:hover {
          .ant-badge-status-text {
            color: ${isContainerStyleHover(type) && blue[4]};
          }
        }
        &:active {
          .ant-badge-status-text {
            color: ${isContainerStyleHover(type) && blue[6]};
          }
        }
      `
    : css`
        cursor: pointer;
        &:hover {
          .ant-badge-status-text {
            color: ${blue[4]};
          }
        }
        &:active {
          .ant-badge-status-text {
            color: ${blue[6]};
          }
        }
      `}
`;

const isContainerStyleHover = (type: JobStatusType) =>
  type === 'failure' || type === 'nodata' || type === 'success' || type === 'canceled' ? true : false;
