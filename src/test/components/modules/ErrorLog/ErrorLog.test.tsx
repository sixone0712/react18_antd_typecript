import { shallow } from 'enzyme';
import React from 'react';
import ErrorLog from '../../../../components/modules/ErrorLog';
import { ErrorLogProps } from '../../../../components/modules/ErrorLog/ErrorLog';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: ErrorLogProps = {};
    const component = shallow(<ErrorLog {...input} />);
  });
});
