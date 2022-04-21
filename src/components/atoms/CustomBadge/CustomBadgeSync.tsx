import { blue } from '@ant-design/colors';
import { css } from '@emotion/react';
import { Badge } from 'antd';
import { PresetColorType } from 'antd/lib/_util/colors';
import { LiteralUnion } from 'antd/lib/_util/type';
import React from 'react';
import CustomIcon from '../CustomIcon';

function CustomBadgeSync({
  size,
  color,
  marginLeft,
  marginRight,
  onClick,
}: {
  size: string;
  color: LiteralUnion<PresetColorType, string>;
  marginLeft?: string;
  marginRight?: string;
  onClick?: () => void;
}): JSX.Element {
  return (
    <div css={style({ marginLeft, marginRight, color, onClick })}>
      <Badge dot color={color}>
        <CustomIcon
          className="sync-icon"
          name="db_sync"
          css={css`
            font-size: ${size};
          `}
          onClick={onClick}
        />
      </Badge>
    </div>
  );
}

const style = ({
  color,
  marginLeft,
  marginRight,
  onClick,
}: {
  color: LiteralUnion<PresetColorType, string>;
  marginLeft?: string;
  marginRight?: string;
  onClick?: () => void;
}) => css`
  margin-left: ${marginLeft};
  margin-right: ${marginRight};

  ${onClick &&
  css`
    .sync-icon {
      cursor: pointer;
      &:hover {
        color: ${blue[4]};
      }
      &:active {
        color: ${blue[6]};
      }
    }
  `}

  .ant-scroll-number {
    ${color === 'green' &&
    css`
      -webkit-animation: blink 1s ease-in-out infinite alternate;
      animation: blink 1s ease-in-out infinite alternate;
      @keyframes blink {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
    `}
  }
`;

export default React.memo(CustomBadgeSync);
