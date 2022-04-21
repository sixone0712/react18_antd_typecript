import React from 'react';
import { css } from '@emotion/react';
import { themeisle_page_not_found } from '../../assets/images';
import { Button } from 'antd';
import { useHistory } from 'react-router';
import { PAGE_URL } from '../../lib/constants';

export type NotFoundProps = {};

export default function NotFound({}: NotFoundProps): JSX.Element {
  const history = useHistory();

  const goToHome = () => {
    history.push(PAGE_URL.STATUS_REMOTE_ROUTE);
  };

  return (
    <div css={style}>
      <img alt="page not found" src={themeisle_page_not_found} />
      <div className="text">Page not found</div>
      <Button className="btn" onClick={goToHome}>
        Go to Home
      </Button>
    </div>
  );
}

const style = css`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  img {
    width: 40rem;
    height: auto;
  }
  .text {
    font-size: 2rem;
    font-weight: 700;
  }
  .btn {
    margin-top: 1rem;
  }
`;
