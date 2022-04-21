import { shallow } from 'enzyme';
import React from 'react';
import RemoteJobStatus from '../../../../components/modules/RemoteJobStatus';

describe('renders the component', () => {
  it('renders correctly', () => {
    const component = shallow(<RemoteJobStatus />);
  });
});
