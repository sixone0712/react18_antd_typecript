import { useForm } from 'antd/lib/form/Form';
import { shallow } from 'enzyme';
import React from 'react';
import ConvertDefineTable from '../../../../components/modules/Convert/ConvertDefineTable';

describe('renders the component', () => {
  const [form] = useForm();
  it('renders correctly', () => {
    // eslint-disable-next-line react/jsx-no-undef
    const component = shallow(<ConvertDefineTable form={form} />);
  });
});
