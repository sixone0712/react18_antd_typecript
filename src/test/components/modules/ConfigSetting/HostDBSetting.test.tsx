import { shallow } from 'enzyme';
import React from 'react';
import HostDBSetting, { HostDBSettingProps } from '../../../../components/modules/ConfigSetting/HostDBSetting';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: HostDBSettingProps = {};
    const component = shallow(<HostDBSetting {...input} />);
  });
});
