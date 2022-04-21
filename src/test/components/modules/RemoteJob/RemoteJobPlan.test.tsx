import { shallow } from 'enzyme';
import React from 'react';
import RemoteJobPlan from '../../../../components/modules/RemoteJob/RemoteJobPlan';

describe('renders the component', () => {
  it('renders correctly', () => {
    const component = shallow(<RemoteJobPlan type="add" />);
  });
});
