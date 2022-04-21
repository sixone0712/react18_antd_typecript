import React, { FunctionComponent, SVGProps } from 'react';
import * as svg from './svg';
import { css, SerializedStyles } from '@emotion/react';
import Icon from '@ant-design/icons';

export type CustomIconType = keyof typeof svg;
export type CustomIconProps = {
  name: CustomIconType;
  className?: string;
  style?: React.CSSProperties;
  css?: SerializedStyles;
  onClick?: () => void;
};

function CustomIcon({ name, className, style, css, onClick }: CustomIconProps): JSX.Element {
  return (
    <Icon
      component={svg[name] as FunctionComponent<SVGProps<SVGSVGElement>>}
      className={className}
      style={style}
      css={css}
      onClick={onClick}
    />
  );
}

export default CustomIcon;
