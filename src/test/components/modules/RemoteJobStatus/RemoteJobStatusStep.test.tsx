import { shallow } from 'enzyme';
import React from 'react';
import RemoteJobStatusStep from '../../../../components/modules/RemoteJobStatus/RemoteJobStatusStep';

describe('renders the component', () => {
  it('renders correctly', () => {
    const component = shallow(<RemoteJobStatusStep />);
  });
});
