import { shallow } from 'enzyme';
import React from 'react';
import FormName from '../../../../components/atoms/CustomForm/FormName';

describe('renders the component', () => {
  it('renders correctly', () => {
    // eslint-disable-next-line react/jsx-no-undef
    const component = shallow(<FormName label="test" name="test" />);
  });
});
