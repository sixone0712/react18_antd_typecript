import { shallow } from 'enzyme';
import React from 'react';
import AccountEditPermission from '../../../../components/modules/Account/AccountEditPermission';

describe('renders the component', () => {
  it('renders correctly', () => {
    // eslint-disable-next-line react/jsx-no-undef
    const component = shallow(
      <AccountEditPermission
        visible
        setVisible={(): any => {}}
        id={1}
        rules={{ isRoleJob: true, isRoleConfigure: true, isRoleRules: true, isRoleAddress: true, isRoleAccount: true }}
        onRefresh={() => {}}
      />
    );
  });
});
