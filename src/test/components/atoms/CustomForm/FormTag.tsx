import { shallow } from 'enzyme';
import React from 'react';
import FormTag from '../../../../components/atoms/CustomForm/FormTag';

describe('renders the component', () => {
  it('renders correctly', () => {
    // eslint-disable-next-line react/jsx-no-undef
    const component = shallow(<FormTag label="test" name="test" setTag={(tags) => {}} tag={[]} />);
  });
});
