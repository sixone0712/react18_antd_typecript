import { useForm } from 'antd/lib/form/Form';
import { shallow } from 'enzyme';
import React from 'react';
import RemoteJobStepsModalAddrBook from '../../../../../components/modules/RemoteJob/Modal/RemoteJobStepsModalAddrBook';
import { FormRemoteJobStepsDrawer } from '../../../../../hooks/remoteJob/useRemoteJobStepsDrawer';

describe('renders the component', () => {
  it('renders correctly', () => {
    const [form] = useForm<FormRemoteJobStepsDrawer>();
    const component = shallow(<RemoteJobStepsModalAddrBook form={form} />);
  });
});
