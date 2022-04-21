import { shallow } from 'enzyme';
import React from 'react';
import BuildHistoryMenu, { BuildHistoryMenuProps } from '../../../../components/modules/BuildHistory/BuildHistoryMenu';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: BuildHistoryMenuProps = {};
    const component = shallow(<BuildHistoryMenu {...input} />);
  });
});
