import { shallow } from 'enzyme';
import { CommonTableEmpty } from '../../../../components/atoms/Common/Common';
import React from 'react';

describe('renders the component', () => {
  it('renders correctly', () => {
    const component = shallow(<CommonTableEmpty isError={false} />);
  });
});
