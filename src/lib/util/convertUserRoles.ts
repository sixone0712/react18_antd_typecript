import { UserRolesBoolean } from '../../reducers/slices/loginUser';
import { UserRole } from '../api/axios/types';
import { USER_ROLE } from '../constants';

export function rolesToBoolean(roles: UserRole[]): UserRolesBoolean {
  const isRoleJob = roles.includes(USER_ROLE.JOB) ? true : false;
  const isRoleConfigure = roles.includes(USER_ROLE.CONFIGURE) ? true : false;
  const isRoleRules = roles.includes(USER_ROLE.RULES) ? true : false;
  const isRoleAddress = roles.includes(USER_ROLE.ADDRESS) ? true : false;
  const isRoleAccount = roles.includes(USER_ROLE.ACCOUNT) ? true : false;

  return {
    isRoleJob,
    isRoleConfigure,
    isRoleRules,
    isRoleAddress,
    isRoleAccount,
  };
}

export function rolesToObject(roles: UserRolesBoolean): UserRole[] {
  const convertRoles: UserRole[] = [];

  if (roles.isRoleJob) convertRoles.push(USER_ROLE.JOB);
  if (roles.isRoleConfigure) convertRoles.push(USER_ROLE.CONFIGURE);
  if (roles.isRoleRules) convertRoles.push(USER_ROLE.RULES);
  if (roles.isRoleAddress) convertRoles.push(USER_ROLE.ADDRESS);
  if (roles.isRoleAccount) convertRoles.push(USER_ROLE.ACCOUNT);

  return convertRoles;
}
