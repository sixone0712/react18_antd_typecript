import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { UserRole } from '../../../lib/api/axios/types';
import { PAGE_URL } from '../../../lib/constants';
import { rolesToObject } from '../../../lib/util/convertUserRoles';
import { LoginUserSelector } from '../../../reducers/slices/loginUser';

export type PrivateRouteProps = {
  path: string | string[];
  role: UserRole;
  children?: React.ReactNode;
};

export default function RoleRoute({ path, role, children }: PrivateRouteProps): JSX.Element {
  const { roles } = useSelector(LoginUserSelector);
  const rolesArray = useMemo(() => rolesToObject(roles), [roles]);

  if (rolesArray.includes(role)) {
    return <Route path={path}>{children}</Route>;
  } else {
    return <Redirect to={PAGE_URL.FORBBIDEN_ROUTE} />;
  }
}
