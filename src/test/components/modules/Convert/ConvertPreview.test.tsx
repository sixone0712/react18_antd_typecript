import { shallow } from 'enzyme';
import React from 'react';
import ConvertPreview from '../../../../components/modules/Convert/ConvertPreview';

describe('renders the component', () => {
  it('renders correctly', () => {
    // eslint-disable-next-line react/jsx-no-undef
    const component = shallow(<ConvertPreview type="convert" />);
  });
});
