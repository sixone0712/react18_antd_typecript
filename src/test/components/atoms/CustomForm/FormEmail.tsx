import { shallow } from 'enzyme';
import React from 'react';
import FormEmail from '../../../../components/atoms/CustomForm/FormEmail';

describe('renders the component', () => {
  it('renders correctly', () => {
    // eslint-disable-next-line react/jsx-no-undef
    const component = shallow(<FormEmail label="test" name="test" />);
  });
});
