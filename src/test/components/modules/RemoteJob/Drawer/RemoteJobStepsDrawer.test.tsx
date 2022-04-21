import { useForm } from 'antd/lib/form/Form';
import { shallow } from 'enzyme';
import React from 'react';
import RemoteJobStepsDrawer from '../../../../../components/modules/RemoteJob/Drawer/RemoteJobStepsDrawer';
import { FormRemoteJobStepsDrawer } from '../../../../../hooks/remoteJob/useRemoteJobStepsDrawer';

describe('renders the component', () => {
  it('renders correctly', () => {
    const [form] = useForm<FormRemoteJobStepsDrawer>();
    const component = shallow(<RemoteJobStepsDrawer form={form} />);
  });
});
