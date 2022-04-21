import { shallow } from 'enzyme';
import React from 'react';
import AccountChangePassword from '../../../../components/modules/Account/AccountChangePassword';

describe('renders the component', () => {
  it('renders correctly', () => {
    // eslint-disable-next-line react/jsx-no-undef
    const component = shallow(<AccountChangePassword visible setVisible={(): any => {}} />);
  });
});
