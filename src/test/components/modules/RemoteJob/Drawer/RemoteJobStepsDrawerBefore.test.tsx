import { useForm } from 'antd/lib/form/Form';
import { shallow } from 'enzyme';
import React from 'react';
import RemoteJobStepsDrawerBefore from '../../../../../components/modules/RemoteJob/Drawer/RemoteJobStepsDrawerBefore';
import { FormRemoteJobStepsDrawer } from '../../../../../hooks/remoteJob/useRemoteJobStepsDrawer';

describe('renders the component', () => {
  it('renders correctly', () => {
    const [form] = useForm<FormRemoteJobStepsDrawer>();
    const component = shallow(<RemoteJobStepsDrawerBefore form={form} />);
  });
});
