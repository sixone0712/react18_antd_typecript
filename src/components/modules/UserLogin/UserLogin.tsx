import { LockOutlined, LoginOutlined, UserOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Button, Col, Form, Input, Row } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useCallback } from 'react';
import { useEffect } from 'react';
import useLogin from '../../../hooks/useLogin';
import useValidateLogin from '../../../hooks/useValidateLogin';
import { ReqLogin } from '../../../lib/api/axios/types';
import CustomIcon from '../../atoms/CustomIcon';

const Container = styled(Row)`
  width: inherit;
  height: inherit;
  flex-direction: column;
  background: linear-gradient(0.43deg, rgba(28, 35, 41, 0) 0.43%, #171e27 0.43%, rgba(65, 77, 101, 0.92) 99.69%);
`;

const LoginSection = styled(Row)`
  width: 31.25rem;
  height: 38.125rem;
  flex-direction: column;
  background-color: #838d98;
  border-radius: 1.5rem;
`;

const Title = styled(Col)`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 2rem;
`;

const LoginForm = styled(Col)``;

export type UserLoginProps = {};

export default function UserLogin({}: UserLoginProps): JSX.Element {
  const { requestLogin, isMutateLogin, moveToRemoteStatus } = useLogin();
  const [form] = useForm<ReqLogin>();
  const { vaildateToken } = useValidateLogin();
  const onFinish = useCallback((loginData: ReqLogin) => {
    requestLogin(loginData);
  }, []);

  useEffect(() => {
    vaildateToken().then((result) => {
      if (result) moveToRemoteStatus();
    });
  }, []);

  return (
    <Container justify="center" align="middle">
      <LoginSection justify="center" align="middle">
        <CustomIcon name="login_user" css={iconStyle} />
        <Title>Welcome</Title>
        <LoginForm>
          <Form onFinish={onFinish} form={form}>
            <Form.Item name="username" rules={[{ required: true, message: 'Please input your Username!' }]}>
              <Input prefix={<UserOutlined />} placeholder="Username" css={inputStyle} />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!' }]}>
              <Input prefix={<LockOutlined />} type="password" placeholder="Password" css={inputStyle} />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<LoginOutlined />}
                css={buttonStyle}
                loading={isMutateLogin}
                disabled={isMutateLogin}
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
        </LoginForm>
      </LoginSection>
    </Container>
  );
}

const iconStyle = css`
  font-size: 6rem;
`;

const inputStyle = css`
  width: 25rem;
  height: 2.75rem;
  border-radius: 0.625rem;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  font-size: 1rem;
`;

const buttonStyle = css`
  width: 25rem;
  height: 2.75rem;
  border-radius: 0.625rem;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  font-size: 1rem;
  background-color: #001529;
  border: 1px solid #d9d9d9;

  &:hover {
    background-color: #334454;
    border: 1px solid #d9d9d9;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }
  &:focus {
    background-color: #334454;
    border: 1px solid #d9d9d9;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }
  &:active {
    background-color: #001121;
    border: 1px solid #d9d9d9;
  }
`;
