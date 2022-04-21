import { shallow } from 'enzyme';
import React from 'react';
import RemoteJobStatusStepList from '../../../../components/modules/RemoteJobStatus/RemoteJobStatusStepList';

describe('renders the component', () => {
  it('renders correctly', () => {
    const component = shallow(<RemoteJobStatusStepList />);
  });
});
