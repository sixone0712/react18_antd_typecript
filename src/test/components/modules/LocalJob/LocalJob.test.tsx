import { shallow } from 'enzyme';
import React from 'react';
import LocalJob from '../../../../components/modules/LocalJob';
import { LocalJobProps } from '../../../../components/modules/LocalJob/LocalJob';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: LocalJobProps = {};
    const component = shallow(<LocalJob {...input} />);
  });
});
