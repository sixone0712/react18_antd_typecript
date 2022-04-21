import { shallow } from 'enzyme';
import React from 'react';
import DashBoardFooter from '../../../../components/modules/DashBoardFooter';
import { DashBoardFooterProps } from '../../../../components/modules/DashBoardFooter/DashBoardFooter';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: DashBoardFooterProps = {};
    const component = shallow(<DashBoardFooter {...input} />);
  });
});
