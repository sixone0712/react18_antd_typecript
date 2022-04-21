import { shallow } from 'enzyme';
import React from 'react';
import FormPassword from '../../../../components/atoms/CustomForm/FormPassword';

describe('renders the component', () => {
  it('renders correctly', () => {
    // eslint-disable-next-line react/jsx-no-undef
    const component = shallow(<FormPassword label="test" name="test" />);
  });
});
