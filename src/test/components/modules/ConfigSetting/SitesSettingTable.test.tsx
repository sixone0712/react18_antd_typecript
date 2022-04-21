import { shallow } from 'enzyme';
import React from 'react';
import SitesSettingTable, {
  SitesSettingTableProps,
} from '../../../../components/modules/ConfigSetting/SitesSettingTable';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: SitesSettingTableProps = {};
    const component = shallow(<SitesSettingTable {...input} />);
  });
});
