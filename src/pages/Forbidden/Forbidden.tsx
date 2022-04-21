import { css } from '@emotion/react';
import { Button } from 'antd';
import React from 'react';
import { useHistory } from 'react-router';
import { undraw_page_forbidden } from '../../assets/images';
import { PAGE_URL } from '../../lib/constants';

export type ForbiddenProps = {};

export default function Forbidden({}: ForbiddenProps): JSX.Element {
  const history = useHistory();

  const goToHome = () => {
    history.push(PAGE_URL.STATUS_REMOTE_ROUTE);
  };

  return (
    <div css={style}>
      <img alt="page forbidden" src={undraw_page_forbidden} />
      <div className="text">Page Forbidden</div>
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
