import { shallow } from 'enzyme';
import React from 'react';
import FormPort from '../../../../components/atoms/CustomForm/FormPort';

describe('renders the component', () => {
  it('renders correctly', () => {
    // eslint-disable-next-line react/jsx-no-undef
    const component = shallow(<FormPort label="test" name="test" />);
  });
});
