import { shallow } from 'enzyme';
import React from 'react';
import AppLayout from '../../../../components/templates/AppLayout';

describe('renders the component', () => {
  it('renders correctly(AppLayout)', () => {
    const component = shallow(<AppLayout />);
  });

  it('renders correctly(Hedaer)', () => {
    const component = shallow(<AppLayout.Hedaer />);
  });

  it('renders correctly(Footer)', () => {
    const component = shallow(<AppLayout.Footer />);
  });

  it('renders correctly(Main)', () => {
    const component = shallow(<AppLayout.Main />);
  });

  it('renders correctly(FullContents)', () => {
    const component = shallow(<AppLayout.FullContents />);
  });
});
