import { shallow } from 'enzyme';
import React from 'react';
import BuildHistoryViewLog, {
  BuildHistoryViewLogProps,
} from '../../../../components/modules/BuildHistory/BuildHistoryViewLog';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: BuildHistoryViewLogProps = {};
    const component = shallow(<BuildHistoryViewLog {...input} />);
  });
});
