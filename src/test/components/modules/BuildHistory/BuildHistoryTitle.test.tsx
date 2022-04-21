import { shallow } from 'enzyme';
import React from 'react';
import BuildHistoryTitle, {
  BuildHistoryTitleProps,
} from '../../../../components/modules/BuildHistory/BuildHistoryTitle';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: BuildHistoryTitleProps = {};
    const component = shallow(<BuildHistoryTitle {...input} />);
  });
});
