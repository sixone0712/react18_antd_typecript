import { shallow } from 'enzyme';
import React from 'react';
import StatusBadge, { StatusBadgeProps } from '../../../../components/atoms/StatusBadge/StatusBadge';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: StatusBadgeProps = {
      type: 'success',
      onClick: () => {},
    };
    const component = shallow(<StatusBadge {...input} />);
  });
});
