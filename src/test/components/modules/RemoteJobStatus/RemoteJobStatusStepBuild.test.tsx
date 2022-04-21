import { shallow } from 'enzyme';
import React from 'react';
import RemoteJobStatusStepBuild from '../../../../components/modules/RemoteJobStatus/RemoteJobStatusStepBuild';

describe('renders the component', () => {
  it('renders correctly', () => {
    const component = shallow(<RemoteJobStatusStepBuild />);
  });
});
