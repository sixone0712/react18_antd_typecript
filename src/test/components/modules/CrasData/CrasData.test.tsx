import { shallow } from 'enzyme';
import React from 'react';
import CrasData from '../../../../components/modules/CrasData';

describe('renders the component', () => {
  it('renders correctly', () => {
    // eslint-disable-next-line react/jsx-no-undef
    const component = shallow(<CrasData />);
  });
});
