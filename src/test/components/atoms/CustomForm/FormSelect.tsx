import { shallow } from 'enzyme';
import React from 'react';
import FormSelect from '../../../../components/atoms/CustomForm/FormSelect';

describe('renders the component', () => {
  it('renders correctly', () => {
    // eslint-disable-next-line react/jsx-no-undef
    const component = shallow(<FormSelect label="test" name="test" options={[]} />);
  });
});
