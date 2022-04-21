import { shallow } from 'enzyme';
import React from 'react';
import EmailSettingView, {
  EmailSettingViewProps,
} from '../../../../components/atoms/EmailSettingView/EmailSettingView';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: EmailSettingViewProps = {
      before: 1,
      recipients: [],
      title: 'Error Summanry',
    };
    // eslint-disable-next-line react/jsx-no-undef
    const component = shallow(<EmailSettingView {...input} />);
  });
});
