import { css } from '@emotion/react';
import { Col, Row, Tooltip } from 'antd';
import { TooltipPlacement } from 'antd/lib/tooltip';
import { PresetColorType } from 'antd/lib/_util/colors';
import { LiteralUnion } from 'antd/lib/_util/type';
import React, { useMemo } from 'react';

export interface PopupTipProps {
  value: number | string;
  list: string[];
  color?: LiteralUnion<PresetColorType, string>;
  placement?: TooltipPlacement;
}
export default function PopupTip({ value, list, color = 'cyan', placement = 'top' }: PopupTipProps): JSX.Element {
  const title = useMemo(
    () => (
      <Row
        css={css`
          flex-direction: column;
        `}
      >
        {list?.map((item, idx) => {
          return <Col key={idx}>{item}</Col>;
        })}
      </Row>
    ),
    [list]
  );

  return (
    <Tooltip title={title} color={color} placement={placement}>
      <span>{value}</span>
    </Tooltip>
  );
}
