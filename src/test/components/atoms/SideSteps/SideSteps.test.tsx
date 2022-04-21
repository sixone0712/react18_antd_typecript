import { shallow } from 'enzyme';
import React from 'react';
import SideSteps, { SideStepsProps } from '../../../../components/atoms/SideSteps/SideSteps';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: SideStepsProps = {
      current: 0,
      stepList: ['Configure', 'Confirm'],
    };
    const component = shallow(<SideSteps {...input} />);
  });
});
