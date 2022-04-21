import { css } from '@emotion/react';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { PAGE_URL } from '../../lib/constants';
import ErrorLogPage from './ErrorLogPage';
import History from './History';
import Local from './Local';
import Remote from './Remote';

export type StatusProps = {};

export default function Status({}: StatusProps): JSX.Element {
  return (
    <Switch>
      <Route path={PAGE_URL.STATUS_LOCAL_ROUTE} exact component={Local} />
      <Route path={PAGE_URL.STATUS_LOCAL_ADD_ROUTE} exact component={Local.AddJob} />
      <Route path={PAGE_URL.STATUS_REMOTE_ROUTE} exact component={Remote} />
      <Route path={PAGE_URL.STATUS_REMOTE_STEP_ROUTE} exact component={Remote.Steps} />
      <Route path={PAGE_URL.STATUS_REMOTE_ADD_ROUTE} exact component={Remote.AddJob} />
      <Route path={PAGE_URL.STATUS_REMOTE_EDIT_ROUTE} exact component={Remote.EditJob} />
      <Route
        path={[PAGE_URL.STATUS_REMOTE_BUILD_HISTORY_ROUTE, PAGE_URL.STATUS_LOCAL_BUILD_HISTORY_ROUTE]}
        component={History}
      />
      <Route path={PAGE_URL.STATUS_ERROR_LOG_ROUTE} exact component={ErrorLogPage} />
    </Switch>
  );
}

const style = css``;
