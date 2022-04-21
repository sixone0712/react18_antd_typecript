import { shallow } from 'enzyme';
import React from 'react';
import SitesSettingAddEdit, {
  SitesSettingAddEditProps,
} from '../../../../components/modules/ConfigSetting/SitesSettingAddEdit';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: SitesSettingAddEditProps = {};
    const component = shallow(<SitesSettingAddEdit {...input} />);
  });
});
