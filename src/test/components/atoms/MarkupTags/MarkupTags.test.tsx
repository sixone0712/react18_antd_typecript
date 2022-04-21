import { css } from '@emotion/react';
import { shallow } from 'enzyme';
import React from 'react';
import MarkupTags, { MarkUpTagsProps } from '../../../../components/atoms/MarkupTags/MarkupTags';
-describe('renders the component', () => {
  it('renders correctly', () => {
    const input: MarkUpTagsProps = {
      tags: [],
      setTags: () => {},
      tagsStyle: css``,
    };
    const component = shallow(<MarkupTags {...input} />);
  });
});
