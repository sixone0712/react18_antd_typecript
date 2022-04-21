import { useForm } from 'antd/lib/form/Form';
import { shallow } from 'enzyme';
import React from 'react';
import ConvertDefineTableLog from '../../../../components/modules/Convert/ConvertDefineTableLog';

describe('renders the component', () => {
  it('renders correctly', () => {
    const [form] = useForm();
    // eslint-disable-next-line react/jsx-no-undef
    const component = shallow(<ConvertDefineTableLog form={form} />);
  });
});
