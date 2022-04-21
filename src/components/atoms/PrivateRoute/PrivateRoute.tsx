import React, { useEffect, useState } from 'react';
import { Route, useHistory, useLocation } from 'react-router-dom';
import useValidateLogin from '../../../hooks/useValidateLogin';
import { PAGE_URL } from '../../../lib/constants';

export type PrivateRouteProps = {
  path: string | string[];
  exact?: boolean;
  children: React.ReactNode;
};

interface LocationReloadKey {
  reloadKey?: string;
}
export default function PrivateRoute({ path, exact = false, children }: PrivateRouteProps): JSX.Element | null {
  const [isloggedin, setLoggedIn] = useState(false);
  const history = useHistory();
  const { vaildateToken } = useValidateLogin();
  const { state } = useLocation<LocationReloadKey>();

  useEffect(() => {
    vaildateToken().then((result) => {
      if (result) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
        history.push(PAGE_URL.LOGIN_ROUTE);
      }
    });
  }, []);

  if (!isloggedin) {
    return null;
  }

  return (
    <Route key={state?.reloadKey} path={path} exact={exact}>
      {children}
    </Route>
  );
}
