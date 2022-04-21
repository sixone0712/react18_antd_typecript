import { css } from '@emotion/react';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from '../../components/atoms/RoleRoute';
import DashBoardBreadcrumb from '../../components/modules/DashBoardBreadcrumb';
import DashBoardFooter from '../../components/modules/DashBoardFooter';
import DashBoardNavBar from '../../components/modules/DashBoardHeader';
import DebugLog from '../../components/modules/DebugLog/DebugLog';
import AppLayout from '../../components/templates/AppLayout';
import { PAGE_URL, USER_ROLE } from '../../lib/constants';
import Account from '../Account';
import Address from '../Address';
import Configure from '../Configure';
import Rules from '../Rules';
import Status from '../Status';

export type DashBoardProps = {};

export default function DashBoard({}: DashBoardProps) {
  return (
    <>
      <AppLayout.Hedaer>
        <DashBoardNavBar />
      </AppLayout.Hedaer>
      <AppLayout.Main>
        <AppLayout.Main.BreadCrumb>
          <DashBoardBreadcrumb />
        </AppLayout.Main.BreadCrumb>
        <AppLayout.Main.Contents>
          <Switch>
            <Route path={PAGE_URL.STATUS_ROUTE}>
              <Status />
            </Route>
            <PrivateRoute path={PAGE_URL.CONFIGURE} role={USER_ROLE.CONFIGURE}>
              <Configure />
            </PrivateRoute>
            <PrivateRoute path={PAGE_URL.RULES_ROUTE} role={USER_ROLE.RULES}>
              <Rules />
            </PrivateRoute>
            <PrivateRoute path={PAGE_URL.ADDRESS_BOOK} role={USER_ROLE.ADDRESS}>
              <Address />
            </PrivateRoute>
            <PrivateRoute path={PAGE_URL.ACCOUNT_ROUTE} role={USER_ROLE.ACCOUNT}>
              <Account />
            </PrivateRoute>
            <Route path={PAGE_URL.DEBUG_LOG_ROUTE}>
              <DebugLog />
            </Route>
          </Switch>
        </AppLayout.Main.Contents>
      </AppLayout.Main>
      <AppLayout.Footer>
        <DashBoardFooter />
      </AppLayout.Footer>
    </>
  );
}

const style = css``;
