import { shallow } from 'enzyme';
import React from 'react';
import ConvertErrorLogModal from '../../../../../components/modules/Convert/Modal/ConvertErrorLogModal';

describe('renders the component', () => {
  it('renders correctly', () => {
    const component = shallow(<ConvertErrorLogModal />);
  });
});
