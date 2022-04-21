import { shallow } from 'enzyme';
import React from 'react';
import StepButton, { StopButtonProps } from '../../../../components/atoms/StepButton/StepButton';
describe('renders the component', () => {
  it('renders correctly', () => {
    const input: StopButtonProps = {
      current: 0,
      lastStep: 4,
      nextAction: () => true,
      setCurrent: () => {},
    };
    const component = shallow(<StepButton {...input} />);
  });
});
