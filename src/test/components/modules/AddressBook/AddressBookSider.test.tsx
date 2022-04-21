import { shallow } from 'enzyme';
import React from 'react';
import AddressBookSider from '../../../../components/modules/AddressBook/AddressBookSider';

describe('renders the component', () => {
  it('renders correctly', () => {
    // eslint-disable-next-line react/jsx-no-undef
    const component = shallow(<AddressBookSider />);
  });
});
