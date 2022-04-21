import { shallow } from 'enzyme';
import React from 'react';
import LocalJobOtherNoticeEmail, {
  LocalJobOtherNoticeEmailProps,
} from '../../../../components/modules/LocalJob/LocalJobOtherNoticeEmail';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: LocalJobOtherNoticeEmailProps = {};
    const component = shallow(<LocalJobOtherNoticeEmail {...input} />);
  });
});
