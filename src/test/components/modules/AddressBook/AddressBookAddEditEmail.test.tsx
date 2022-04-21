import { shallow } from 'enzyme';
import React from 'react';
import AddressBookAddEditEmail from '../../../../components/modules/AddressBook/AddressBookAddEditEmail';

describe('renders the component', () => {
  it('renders correctly', () => {
    // eslint-disable-next-line react/jsx-no-undef
    const component = shallow(<AddressBookAddEditEmail />);
  });
});
