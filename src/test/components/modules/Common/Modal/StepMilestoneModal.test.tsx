import { shallow } from 'enzyme';
import React from 'react';
import StepMilestoneModal, {
  StepMilestoneModalProps,
} from '../../../../../components/modules/Common/Modal/StepMilestoneModal';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: StepMilestoneModalProps = {
      steps: [],
      visible: true,
      setVisible: (value: boolean) => {},
    };
    const component = shallow(<StepMilestoneModal {...input} />);
  });
});
