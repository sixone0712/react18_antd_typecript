import { shallow } from 'enzyme';
import React from 'react';
import RoleRoute from '../../../../components/atoms/RoleRoute';
import { USER_ROLE } from '../../../../lib/constants';

describe('renders the component', () => {
  it('renders correctly', () => {
    // eslint-disable-next-line react/jsx-no-undef
    const component = shallow(<RoleRoute path="/test" role={USER_ROLE.JOB} />);
  });
});
