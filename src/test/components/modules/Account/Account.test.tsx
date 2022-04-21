import { shallow } from 'enzyme';
import React from 'react';
import Account from '../../../../pages/Account';

describe('renders the component', () => {
  it('renders correctly', () => {
    // eslint-disable-next-line react/jsx-no-undef
    const component = shallow(<Account />);
  });
});
