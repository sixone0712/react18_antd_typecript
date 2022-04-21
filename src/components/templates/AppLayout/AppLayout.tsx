import React from 'react';
import { css } from '@emotion/react';
import { Layout as AntdLayout } from 'antd';

const { Header: AntdHeader, Content: AntdContent, Footer: AntdFooter } = AntdLayout;

export type AppLayoutProps = {
  children?: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps): JSX.Element {
  return <AntdLayout css={style}>{children}</AntdLayout>;
}

const style = css``;

function Header({ children }: AppLayoutProps): JSX.Element {
  return <AntdHeader css={headerstyle}>{children}</AntdHeader>;
}

const headerstyle = css`
  box-shadow: 0rem 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  /* height: 4rem; */
  width: 100%;
  position: fixed;
  z-index: 300;
  /* height: 7.1vh; */
  min-height: 4rem;
  min-width: 90rem;
`;

function Main({ children }: AppLayoutProps): JSX.Element {
  return <AntdContent css={mainStyle}>{children}</AntdContent>;
}

const mainStyle = css`
  padding: 4rem 3.125rem 0 3.125rem;
  /* height: 86.9vh;
  min-height: 48.875rem;
  background-color: #070606; */
  z-index: 200;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 90rem;
`;

function BreadCrumb({ children }: AppLayoutProps): JSX.Element {
  return <div css={breadCrumbStyle}>{children}</div>;
}

const breadCrumbStyle = css`
  /* height: 6vh; */
  min-height: 3.375rem;
  display: flex;
  min-width: 87rem;
`;

function Contents({ children }: AppLayoutProps): JSX.Element {
  return <div css={contentsStyle}>{children}</div>;
}

const contentsStyle = css`
  /* height: 80.889vh; */
  min-height: 53.25rem;
  margin-bottom: 0.75rem;

  background-color: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 1px;
  min-width: 87rem;
`;

export function Footer({ children }: AppLayoutProps): JSX.Element {
  return <AntdFooter css={footerstyle}>{children}</AntdFooter>;
}

const footerstyle = css`
  padding-top: 1rem;
  padding-bottom: 1rem;
  /* height: 6vh; */
  min-height: 3.375rem;
  display: flex;
  justify-content: center;
`;

function FullContents({ children }: AppLayoutProps): JSX.Element {
  return <AntdContent css={fullcontentsStyle}>{children}</AntdContent>;
}

const fullcontentsStyle = css`
  width: 100%;
  height: 100vh;
`;

AppLayout.Hedaer = Header;
Main.BreadCrumb = BreadCrumb;
Main.Contents = Contents;
AppLayout.Main = Main;
AppLayout.Footer = Footer;
AppLayout.FullContents = FullContents;
