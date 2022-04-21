import { ReloadOutlined } from '@ant-design/icons';
import { css, Interpolation, Theme } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Col, Row, Space } from 'antd';
import React from 'react';

export type ConfigTitleBtn = {
  name?: string;
  icon: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  action(): void;
};

export type ConfigTitleProps = {
  title: string;
  icon: React.ReactNode;
  firstBtnProps: ConfigTitleBtn;
  secondBtnProps?: ConfigTitleBtn;
  css?: Interpolation<Theme>;
};

export default function ConfigTitle({
  title,
  icon,
  firstBtnProps,
  secondBtnProps,
  css,
}: ConfigTitleProps): JSX.Element {
  return (
    <TitleSection css={css}>
      <Space css={titleStyle}>
        {icon}
        <Title>{title}</Title>
      </Space>
      <Space>
        {firstBtnProps && (
          <Button
            type="primary"
            icon={firstBtnProps.icon}
            css={btnStyle}
            onClick={firstBtnProps.action}
            loading={firstBtnProps.loading}
            disabled={firstBtnProps.disabled}
          >
            {firstBtnProps.name}
          </Button>
        )}
        {secondBtnProps && (
          <Button
            type="primary"
            icon={secondBtnProps.icon}
            css={btnStyle}
            onClick={secondBtnProps.action}
            loading={secondBtnProps.loading}
            disabled={secondBtnProps.disabled}
          />
        )}
      </Space>
    </TitleSection>
  );
}

const TitleSection = styled(Row)`
  background: linear-gradient(90deg, #bae7ff 0.87%, rgba(255, 255, 255, 0) 100%);
  height: 3.125rem;
  justify-content: space-between;
`;
const Title = styled(Col)``;

const titleStyle = css`
  font-size: 1.125rem;
  margin-left: 0.5rem;
`;

const btnStyle = css`
  border-radius: 0.625rem;
`;
