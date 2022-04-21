import { shallow } from 'enzyme';
import React from 'react';
import ConfigSetting from '../../../../components/modules/ConfigSetting';
import { ConfigSettingProps } from '../../../../components/modules/ConfigSetting/ConfigSetting';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: ConfigSettingProps = {};
    const component = shallow(<ConfigSetting {...input} />);
  });
});
