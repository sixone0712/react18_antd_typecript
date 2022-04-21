import { shallow } from 'enzyme';
import React from 'react';
import RemoteJobSteps from '../../../../components/modules/RemoteJob/RemoteJobSteps';

describe('renders the component', () => {
  it('renders correctly', () => {
    const component = shallow(<RemoteJobSteps />);
  });
});
