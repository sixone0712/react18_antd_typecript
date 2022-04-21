import { shallow } from 'enzyme';
import React from 'react';
import ErrorLogImport from '../../../../../components/modules/ErrorLog/Modal/ErrorLogImport';

describe('renders the component', () => {
  it('renders correctly', () => {
    const component = shallow(<ErrorLogImport />);
  });
});
