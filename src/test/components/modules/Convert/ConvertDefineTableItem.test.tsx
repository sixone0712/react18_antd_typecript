import { shallow } from 'enzyme';
import React from 'react';
import {
  ConvertDataType,
  ConvertDefaultValue,
  ConvertInput,
  ConvertInputNumber,
  ConvertOutputColumnSelect,
  ConvertRegex,
} from '../../../../components/modules/Convert/ConvertDefineTableItem';

describe('renders the component', () => {
  it('renders correctly', () => {
    const component1 = shallow(<ConvertInput record={{} as any} onChange={() => {}} keyName="name" />);

    const component2 = shallow(
      <ConvertOutputColumnSelect record={{} as any} onChange={() => {}} onChangeSelect={() => {}} options={[]} isNew />
    );

    const component3 = shallow(<ConvertDataType record={{} as any} onChangeDataType={() => {}} options={[] as any} />);

    const component4 = shallow(
      <ConvertDefaultValue
        record={{} as any}
        onChangeDefValue={() => {}}
        onChangeDefType={() => {}}
        options={[] as any}
      />
    );

    const component5 = shallow(<ConvertInputNumber record={{} as any} onChange={() => {}} keyName="coef" />);

    const component6 = shallow(<ConvertRegex record={{} as any} onClick={() => {}} />);
  });
});
