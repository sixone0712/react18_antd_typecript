import { shallow } from 'enzyme';
import React from 'react';
import PopupTip, { PopupTipProps } from '../../../../components/atoms/PopupTip/PopupTip';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: PopupTipProps = {
      list: [],
      value: '',
    };
    const component = shallow(<PopupTip {...input} />);
  });
});
