import { shallow } from 'enzyme';
import React from 'react';
import {
  ConvertTableCoefTooltip,
  ConvertTableDataTypeTooltip,
  ConvertTableDefaultValue,
  ConvertTableNameTooltip,
  ConvertTableRowIndexTooltip,
  ConvertTableTitle,
} from '../../../../components/modules/Convert/ConvertTitleItem';

describe('renders the component', () => {
  it('renders correctly', () => {
    // eslint-disable-next-line react/jsx-no-undef
    const component1 = shallow(ConvertTableNameTooltip);

    const component2 = shallow(ConvertTableRowIndexTooltip);

    const component3 = shallow(ConvertTableDataTypeTooltip);

    const component4 = shallow(ConvertTableCoefTooltip);

    const component5 = shallow(ConvertTableDefaultValue);

    const component6 = shallow(<ConvertTableTitle title="test" tooltip={<div></div>} />);
  });
});
