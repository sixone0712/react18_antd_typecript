import { shallow } from 'enzyme';
import React from 'react';
import LocalJobOther, { LocalJobOtherProps } from '../../../../components/modules/LocalJob/LocalJobOther';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: LocalJobOtherProps = {};
    const component = shallow(<LocalJobOther {...input} />);
  });
});
