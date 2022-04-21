import { shallow } from 'enzyme';
import React from 'react';
import SitesSetting, { SitesSettingProps } from '../../../../components/modules/ConfigSetting/SitesSetting';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: SitesSettingProps = {};
    const component = shallow(<SitesSetting {...input} />);
  });
});
