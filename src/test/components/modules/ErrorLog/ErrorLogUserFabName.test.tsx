import { shallow } from 'enzyme';
import React from 'react';
import ErrorLogUserFabName, {
  ErrorLogUserFabNameProps,
} from '../../../../components/modules/ErrorLog/ErrorLogUserFabName';

describe('renders the component', () => {
  it('renders correctly', () => {
    const input: ErrorLogUserFabNameProps = {};
    const component = shallow(<ErrorLogUserFabName {...input} />);
  });
});
