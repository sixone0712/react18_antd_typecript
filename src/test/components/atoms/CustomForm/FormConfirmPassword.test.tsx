import { shallow } from 'enzyme';
import React from 'react';
import FormConfirmPassword from '../../../../components/atoms/CustomForm/FormConfirmPassword';

describe('renders the component', () => {
  it('renders correctly', () => {
    // eslint-disable-next-line react/jsx-no-undef
    const component = shallow(<FormConfirmPassword label="test" name="test" />);
  });
});
