import { useForm } from 'antd/lib/form/Form';
import { shallow } from 'enzyme';
import React from 'react';
import ConvertSelectRule from '../../../../components/modules/Convert/ConvertSelectRule';

describe('renders the component', () => {
  const [form] = useForm();
  it('renders correctly', () => {
    // eslint-disable-next-line react/jsx-no-undef
    const component = shallow(<ConvertSelectRule form={form} />);
  });
});
