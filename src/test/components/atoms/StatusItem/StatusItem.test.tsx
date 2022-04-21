import { shallow } from 'enzyme';
import React from 'react';
import StatusItem, { StatusItemProps } from '../../../../components/atoms/StatusItem/StatusItem';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: StatusItemProps = {
      status: 'success',
      onClick: () => {},
    };
    const component = shallow(<StatusItem {...input} />);
  });
});
