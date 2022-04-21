import { shallow } from 'enzyme';
import React from 'react';
import AddressBookContent from '../../../../components/modules/AddressBook/AddressBookContent';

describe('renders the component', () => {
  it('renders correctly', () => {
    // eslint-disable-next-line react/jsx-no-undef
    const component = shallow(<AddressBookContent />);
  });
});
