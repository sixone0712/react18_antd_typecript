import { shallow } from 'enzyme';
import React from 'react';
import CustomIcon from '../../../../components/atoms/CustomIcon';
import { CustomIconProps } from '../../../../components/atoms/CustomIcon/CustomIcon';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: CustomIconProps = {
      name: 'circle',
    };
    // eslint-disable-next-line react/jsx-no-undef
    const component = shallow(<CustomIcon {...input} />);
  });
});
