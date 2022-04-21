import { shallow } from 'enzyme';
import React from 'react';
import RemoteJobCheck from '../../../../components/modules/RemoteJob/RemoteJobCheck';

describe('renders the component', () => {
  it('renders correctly', () => {
    const component = shallow(<RemoteJobCheck />);
  });
});
