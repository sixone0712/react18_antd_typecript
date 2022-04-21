import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Col, Row, Space } from 'antd';
import React from 'react';
import { convertRemToPixels } from '../../../lib/util/remToPixcels';

export type TableHeaderProps = {
  title: string | React.ReactNode;
  button1?: {
    name?: string;
    icon?: JSX.Element;
    onClick?: () => void;
    isLoading?: boolean;
    disabled?: boolean;
  };
  button2?: {
    name?: string;
    icon?: JSX.Element;
    onClick?: () => void;
    isLoading?: boolean;
    disabled?: boolean;
  };
};

const Container = styled(Row)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled(Col)`
  font-size: 1rem;
`;

const ButtonSection = styled(Col)``;

export default function TableHeader({ title, button1, button2 }: TableHeaderProps): JSX.Element {
  return (
    <Container>
      <Title>{title}</Title>
      <ButtonSection>
        <Space size={convertRemToPixels(0.5)}>
          {button1 && (
            <Button
              type="primary"
              icon={button1.icon}
              css={btnStyle}
              onClick={button1.onClick}
              disabled={button1.isLoading || button1.disabled}
            >
              {button1.name}
            </Button>
          )}
          {button2 && (
            <Button
              type="primary"
              icon={button2.icon}
              css={btnStyle}
              onClick={button2.onClick}
              disabled={button2.isLoading}
            >
              {button2.name}
            </Button>
          )}
        </Space>
      </ButtonSection>
    </Container>
  );
}

const btnStyle = css`
  border-radius: 0.625rem;
`;
