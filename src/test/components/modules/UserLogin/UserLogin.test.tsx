import { shallow } from 'enzyme';
import React from 'react';
import UserLogin from '../../../../components/modules/UserLogin';

describe('renders the component', () => {
  it('renders correctly', () => {
    const component = shallow(<UserLogin />);
  });
});
