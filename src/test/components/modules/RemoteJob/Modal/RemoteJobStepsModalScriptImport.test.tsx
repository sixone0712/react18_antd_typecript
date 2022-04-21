import { shallow } from 'enzyme';
import React from 'react';
import RemoteJobStepsModalScriptImport from '../../../../../components/modules/RemoteJob/Modal/RemoteJobStepsModalScriptImport';

describe('renders the component', () => {
  it('renders correctly', () => {
    const props = {
      visible: true,
      setVisible: (isImportScript: boolean) => {},
      onChangeScript: (script: string | null) => {},
    };
    const component = shallow(<RemoteJobStepsModalScriptImport {...props} />);
  });
});
