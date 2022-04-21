import { useForm } from 'antd/lib/form/Form';
import { shallow } from 'enzyme';
import React from 'react';
import RemoteJobStepsDrawerEmail from '../../../../../components/modules/RemoteJob/Drawer/RemoteJobStepsDrawerEmail';
import { FormRemoteJobStepsDrawer } from '../../../../../hooks/remoteJob/useRemoteJobStepsDrawer';

describe('renders the component', () => {
  it('renders correctly', () => {
    const [form] = useForm<FormRemoteJobStepsDrawer>();
    const component = shallow(<RemoteJobStepsDrawerEmail form={form} />);
  });
});
