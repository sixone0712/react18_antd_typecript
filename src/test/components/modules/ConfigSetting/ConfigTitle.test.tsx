import { shallow } from 'enzyme';
import React from 'react';
import CustomIcon from '../../../../components/atoms/CustomIcon';
import ConfigTitle, { ConfigTitleProps } from '../../../../components/modules/ConfigSetting/ConfigTitle';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: ConfigTitleProps = {
      firstBtnProps: {
        action: () => {},
        icon: <CustomIcon name="circle" />,
      },
      title: 'test',
      icon: <CustomIcon name="check_setting" />,
    };
    const component = shallow(<ConfigTitle {...input} />);
  });
});
