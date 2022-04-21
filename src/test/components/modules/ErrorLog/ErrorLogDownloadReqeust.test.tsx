import { shallow } from 'enzyme';
import React from 'react';
import { ErrorLogTableHeaderProps } from '../../../../components/modules/ErrorLog/ErrorLogTableHeader';
import ErrorLogDownloadReqeust from '../../../../components/modules/ErrorLog/Modal/ErrorLogDownloadReqeust';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: ErrorLogTableHeaderProps = {
      title: 'test',
    };
    const component = shallow(<ErrorLogDownloadReqeust {...input} />);
  });
});
