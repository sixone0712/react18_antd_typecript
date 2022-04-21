import { shallow } from 'enzyme';
import React from 'react';
import FormIpAddressWithLocalhost from '../../../../components/atoms/CustomForm/FormIpAddressWithLocalhost';

describe('renders the component', () => {
  it('renders correctly', () => {
    // eslint-disable-next-line react/jsx-no-undef
    const component = shallow(
      <FormIpAddressWithLocalhost label="test" name="test" localhost onClickLocalhost={() => {}} />
    );
  });
});
