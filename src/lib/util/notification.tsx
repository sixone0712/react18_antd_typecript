import React from 'react';
import { notification } from 'antd';
import dayjs from 'dayjs';
import styled from '@emotion/styled';
import { IconType } from 'antd/lib/notification';
import { css } from '@emotion/react';
import { AxiosError } from 'axios';
import { v4 as uuidv4 } from 'uuid';

const DivDate = styled.div`
  text-align: right;
  font-size: 13px;
  color: gray;
`;

export interface OpenNotification {
  (
    type: IconType,
    message: React.ReactNode,
    description: React.ReactNode,
    // errorMsg?: string,
    // status?: string | number,
    // statusText?: string
    error?: AxiosError
  ): void;
}

export const openNotification: OpenNotification = (type, message, description, error) => {
  // if (type === 'error') {
  //   notification.destroy();
  // }

  const status = error?.response?.status;
  const statusText = status ? convertStatusCode(status) : null;
  const reason = error?.response?.data.message;

  const key = uuidv4();

  notification[type]({
    message: message,
    key,
    onClick: () => notification.close(key),
    description: (
      <>
        <div css={style}>
          {Array.isArray(description) ? description.map((item, idx) => <div key={idx}>{item}</div>) : description}
          {reason && (
            <>
              <p />
              <div>{`Reason : ${reason}`}</div>
            </>
          )}
          {status && statusText && <div>{`Status : ${statusText}(${status})`}</div>}
          {status && !statusText && <div>{`Status : ${status}`}</div>}
        </div>
        <p />
        <DivDate>{dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm:ss')}</DivDate>
      </>
    ),
    duration: type === 'error' ? 0 : 4.5,
  });
};

const style = css`
  display: flex;
  flex-direction: column;
`;

const convertStatusCode = (code: number) => {
  switch (code) {
    case 200:
      return 'OK';
    case 201:
      return 'Created';
    case 202:
      return 'Accepted';
    case 204:
      return 'No Content';
    case 400:
      return 'Bad Request';
    case 401:
      return 'Unauthorized';
    case 403:
      return 'Forbidden';
    case 404:
      return 'Not Found';
    case 405:
      return 'Method Not Allowd';
    case 409:
      return 'Conflict';
    case 429:
      return 'Too many Requests';
    case 500:
      return 'Internal Server Error';
    case 502:
      return 'Bad Gateway';
    case 503:
      return 'Service Unavailable';
    case 504:
      return 'Gateway Timeout';
    default:
      break;
  }
  return null;
};
