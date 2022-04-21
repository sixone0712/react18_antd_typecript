import { shallow } from 'enzyme';
import React from 'react';
import SessionTimeoutV2 from '../../../../components/modules/SessionTimeout/SessionTimeoutV2';

describe('renders the component', () => {
  it('renders correctly', () => {
    const component = shallow(<SessionTimeoutV2 />);
  });
});
