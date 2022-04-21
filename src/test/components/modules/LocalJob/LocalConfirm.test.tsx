import { shallow } from 'enzyme';
import React from 'react';
import LocalJobCheck, { LocalConfirmProps } from '../../../../components/modules/LocalJob/LocalJobCheck';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: LocalConfirmProps = {};
    const component = shallow(<LocalJobCheck {...input} />);
  });
});
