import { css } from '@emotion/react';
import React from 'react';
import UserLogin from '../../components/modules/UserLogin';
import AppLayout from '../../components/templates/AppLayout';

export type LoginProps = {
  children?: React.ReactNode;
};

export default function Login({ children }: LoginProps) {
  return (
    <AppLayout.FullContents>
      <UserLogin />
    </AppLayout.FullContents>
  );
}

const style = css``;
