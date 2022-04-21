import { shallow } from 'enzyme';
import React from 'react';
import CrasDataEdit from '../../../../components/modules/CrasData/CrasDataEdit';

describe('renders the component', () => {
  it('renders correctly', () => {
    // eslint-disable-next-line react/jsx-no-undef
    const component = shallow(<CrasDataEdit type="create" />);
  });
});
