import { shallow } from 'enzyme';
import React from 'react';
import FormInput from '../../../../components/atoms/CustomForm/FormInput';

describe('renders the component', () => {
  it('renders correctly', () => {
    // eslint-disable-next-line react/jsx-no-undef
    const component = shallow(<FormInput label="test" name="test" />);
  });
});
