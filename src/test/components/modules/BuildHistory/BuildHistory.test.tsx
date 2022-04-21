import { shallow } from 'enzyme';
import React from 'react';
import BuildHistory, { BuildHistoryProps } from '../../../../components/modules/BuildHistory/BuildHistory';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: BuildHistoryProps = {};
    const component = shallow(<BuildHistory {...input} />);
  });
});
