import { shallow } from 'enzyme';
import React from 'react';
import FormNumber from '../../../../components/atoms/CustomForm/FormNumber';

describe('renders the component', () => {
  it('renders correctly', () => {
    // eslint-disable-next-line react/jsx-no-undef
    const component = shallow(<FormNumber label="test" name="test" />);
  });
});
