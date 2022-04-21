import { shallow } from 'enzyme';
import React from 'react';
import DashBoardBreadcrumb from '../../../../components/modules/DashBoardBreadcrumb';
import { DashBoardBreadcrumbProps } from '../../../../components/modules/DashBoardBreadcrumb/DashBoardBreadcrumb';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: DashBoardBreadcrumbProps = {};
    const component = shallow(<DashBoardBreadcrumb {...input} />);
  });
});
