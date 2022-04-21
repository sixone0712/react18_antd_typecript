import { shallow } from 'enzyme';
import React from 'react';
import FormIpAddress from '../../../../components/atoms/CustomForm/FormIpAddress';

describe('renders the component', () => {
  it('renders correctly', () => {
    // eslint-disable-next-line react/jsx-no-undef
    const component = shallow(<FormIpAddress label="test" name="test" />);
  });
});
