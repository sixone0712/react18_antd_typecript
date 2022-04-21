import { useForm } from 'antd/lib/form/Form';
import { shallow } from 'enzyme';
import React from 'react';
import RemoteJobStepsDrawerRules from '../../../../../components/modules/RemoteJob/Drawer/RemoteJobStepsDrawerRules';
import { FormRemoteJobStepsDrawer } from '../../../../../hooks/remoteJob/useRemoteJobStepsDrawer';

describe('renders the component', () => {
  it('renders correctly', () => {
    const [form] = useForm<FormRemoteJobStepsDrawer>();
    const component = shallow(<RemoteJobStepsDrawerRules form={form} />);
  });
});
