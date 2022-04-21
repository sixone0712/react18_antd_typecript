import React, { useEffect } from 'react';
import { css } from '@emotion/react';
import ErrorLogUserFabName from './ErrorLogUserFabName';
import ErrorLogTable from './ErrorLogTable';
import { useDispatch } from 'react-redux';
import { initErrorLogReducer } from '../../../reducers/slices/errorLog';

export type ErrorLogProps = {};

export default function ErrorLog({}: ErrorLogProps): JSX.Element {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initErrorLogReducer());
  }, []);

  return (
    <div css={style}>
      <div className="layout">
        <ErrorLogUserFabName />
        <div className="v-space"></div>
        <ErrorLogTable />
      </div>
    </div>
  );
}

const style = css`
  display: flex;
  background-color: white;
  width: inherit;

  .layout {
    display: flex;
    flex-direction: column;
    width: 87rem;
    padding-left: 1.75rem;
    padding-right: 1.75rem;
    margin-top: 1.875rem;
    flex-wrap: nowrap;

    .v-space {
      height: 3rem;
    }
  }
`;
