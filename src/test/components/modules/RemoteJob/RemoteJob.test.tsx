import { shallow } from 'enzyme';
import React from 'react';
import RemoteJob from '../../../../components/modules/RemoteJob';
import { RemoteJobProps } from '../../../../components/modules/RemoteJob/RemoteJob';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: RemoteJobProps = {
      type: 'add',
    };
    const component = shallow(<RemoteJob {...input} />);
  });
});
