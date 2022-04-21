import { shallow } from 'enzyme';
import React from 'react';
import RemoteJobStepsModalScript, {
  RemoteJobStepsModalScriptProps,
} from '../../../../../components/modules/RemoteJob/Modal/RemoteJobStepsModalScript';

describe('renders the component', () => {
  it('renders correctly', () => {
    const props: RemoteJobStepsModalScriptProps = {
      type: 'python',
      title: 'test',
      visible: true,
      setVisible: (value: boolean) => {},
      script: null,
      onChangeScript: (value: string | null) => {},
    };
    const component = shallow(<RemoteJobStepsModalScript {...props} />);
  });
});
