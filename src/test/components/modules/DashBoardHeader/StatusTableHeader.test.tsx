import { shallow } from 'enzyme';
import React from 'react';
import StatusTableHeader from '../../../../components/modules/StatusTableHeader/StatusTableHeader';

describe('renders the component', () => {
  it('renders correctly', () => {
    const component = shallow(
      <StatusTableHeader
        title={{
          name: 'test',
        }}
      />
    );
  });
});
