import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Col, Row, Space } from 'antd';
import React from 'react';
import { convertRemToPixels } from '../../../lib/util/remToPixcels';

export type StatusTableHeaderProps = {
  title: {
    name: string;
    count?: number;
  };
  addBtn?: {
    name: string;
    onClick?: () => void;
  };
  refreshBtn?: {
    onClick: () => void;
  };
  isLoading?: boolean;
  disabled?: boolean;
};

const Container = styled(Row)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RegisteredCount = styled(Col)`
  font-size: 1rem;
`;

const ButtonSection = styled(Col)``;

export default function StatusTableHeader({
  title,
  addBtn,
  refreshBtn,
  isLoading = false,
  disabled = false,
}: StatusTableHeaderProps): JSX.Element {
  return (
    <Container>
      <RegisteredCount>{title.count !== undefined ? `${title.name} : ${title.count}` : title.name}</RegisteredCount>
      <ButtonSection>
        <Space size={convertRemToPixels(0.5)}>
          {addBtn && (
            <Button type="primary" icon={<PlusOutlined />} css={btnStyle} onClick={addBtn.onClick} disabled={isLoading}>
              {addBtn.name}
            </Button>
          )}
          {refreshBtn && (
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              css={btnStyle}
              onClick={refreshBtn.onClick}
              loading={isLoading}
              disabled={disabled}
            />
          )}
        </Space>
      </ButtonSection>
    </Container>
  );
}

const btnStyle = css`
  border-radius: 0.625rem;
`;
