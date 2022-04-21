import { shallow } from 'enzyme';
import React from 'react';
import AccountAddUser from '../../../../components/modules/Account/AccountAddUser';

describe('renders the component', () => {
  it('renders correctly', () => {
    // eslint-disable-next-line react/jsx-no-undef
    const component = shallow(<AccountAddUser visible setVisible={(): any => {}} />);
  });
});
