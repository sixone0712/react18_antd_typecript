import { shallow } from 'enzyme';
import React from 'react';
import FormReadOnly from '../../../../components/atoms/CustomForm/FormReadOnly';

describe('renders the component', () => {
  it('renders correctly', () => {
    // eslint-disable-next-line react/jsx-no-undef
    const component = shallow(<FormReadOnly label="test" name="test" />);
  });
});
