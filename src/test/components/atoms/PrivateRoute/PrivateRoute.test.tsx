import { shallow } from 'enzyme';
import React from 'react';
import PrivateRoute from '../../../../components/atoms/PrivateRoute';

describe('renders the component', () => {
  it('renders correctly', () => {
    // eslint-disable-next-line react/jsx-no-undef
    const component = shallow(<PrivateRoute path="/test" children={<div></div>} />);
  });
});
