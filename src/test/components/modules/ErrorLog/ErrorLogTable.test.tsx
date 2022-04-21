import { shallow } from 'enzyme';
import React from 'react';
import ErrorLogTable, { ErrorLogTableProps } from '../../../../components/modules/ErrorLog/ErrorLogTable';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: ErrorLogTableProps = {};
    const component = shallow(<ErrorLogTable {...input} />);
  });
});
