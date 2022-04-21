import { shallow } from 'enzyme';
import React from 'react';
import TableHeader from '../../../../components/modules/TableHeader';

describe('renders the component', () => {
  it('renders correctly', () => {
    const component = shallow(<TableHeader title={{ name: 'test' }} />);
  });
});
