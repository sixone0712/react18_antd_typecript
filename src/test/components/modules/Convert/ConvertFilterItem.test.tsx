import { shallow } from 'enzyme';
import React from 'react';
import {
  ConvertFilterCondition,
  ConvertFilterName,
  ConvertFilterType,
} from '../../../../components/modules/Convert/ConvertFilterItem';

describe('renders the component', () => {
  it('renders correctly', () => {
    // eslint-disable-next-line react/jsx-no-undef
    const component1 = shallow(<ConvertFilterName record={{} as any} onChange={() => {}} />);

    const component2 = shallow(
      <ConvertFilterType record={{} as any} onChangeDataType={() => {}} options={[] as any} />
    );

    const component3 = shallow(<ConvertFilterCondition record={{} as any} onChange={() => {}} />);
  });
});
