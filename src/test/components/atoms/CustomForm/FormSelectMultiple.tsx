import { shallow } from 'enzyme';
import React from 'react';
import FormSelectMultiple from '../../../../components/atoms/CustomForm/FormSelectMultiple';

describe('renders the component', () => {
  it('renders correctly', () => {
    // eslint-disable-next-line react/jsx-no-undef
    const component = shallow(<FormSelectMultiple label="test" name="test" options={[]} />);
  });
});
