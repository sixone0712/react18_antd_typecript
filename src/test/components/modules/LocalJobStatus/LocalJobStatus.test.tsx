import { shallow } from 'enzyme';
import React from 'react';
import LocalJobStatus from '../../../../components/modules/LocalJobStatus';

describe('renders the component', () => {
  it('renders correctly', () => {
    const component = shallow(<LocalJobStatus />);
  });
});
