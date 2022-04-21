import { shallow } from 'enzyme';
import React from 'react';
import AccountTable from '../../../../components/modules/Account/AccountTable';

describe('renders the component', () => {
  it('renders correctly', () => {
    // eslint-disable-next-line react/jsx-no-undef
    const component = shallow(<AccountTable />);
  });
});
