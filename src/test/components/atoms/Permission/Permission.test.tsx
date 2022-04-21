import { shallow } from 'enzyme';
import React from 'react';
import Permission from '../../../../components/atoms/Permission';

describe('renders the component', () => {
  it('renders correctly', () => {
    // eslint-disable-next-line react/jsx-no-undef
    const component = shallow(
      <Permission
        rules={{ isRoleJob: true, isRoleConfigure: true, isRoleRules: true, isRoleAddress: true, isRoleAccount: true }}
        setRules={(): any => {}}
        loggedInUserRoles={{
          isRoleJob: true,
          isRoleConfigure: true,
          isRoleRules: true,
          isRoleAddress: true,
          isRoleAccount: true,
        }}
      />
    );
  });
});
