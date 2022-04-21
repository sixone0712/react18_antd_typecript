import { shallow } from 'enzyme';
import React from 'react';
import TableTitle from '../../../../components/atoms/TableTitle';
describe('renders the component', () => {
  it('renders correctly', () => {
    const component = shallow(<TableTitle />);
  });
});
