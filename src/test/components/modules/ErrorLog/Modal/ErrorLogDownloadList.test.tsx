import { shallow } from 'enzyme';
import React from 'react';
import ErrorLogDownloadList, {
  ErrorLogDownloadListProps,
} from '../../../../../components/modules/ErrorLog/Modal/ErrorLogDownloadList';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: ErrorLogDownloadListProps = {};
    const component = shallow(<ErrorLogDownloadList {...input} />);
  });
});
